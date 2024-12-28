import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Investment, Withdrawal } from "@/types/supabase";

interface EditTransactionDialogProps {
  transaction: Investment | Withdrawal;
  type: 'investment' | 'withdrawal';
  onTransactionUpdated: () => void;
}

export const EditTransactionDialog = ({ transaction, type, onTransactionUpdated }: EditTransactionDialogProps) => {
  const [editingTransaction, setEditingTransaction] = useState<Investment | Withdrawal>(transaction);

  const handleUpdateTransaction = async () => {
    try {
      const table = type === 'investment' ? 'investments' : 'withdrawals';
      const { error } = await supabase
        .from(table)
        .update({
          amount: editingTransaction.amount,
          status: editingTransaction.status,
          is_cancelled: editingTransaction.is_cancelled,
          ...(type === 'investment' && { payment_method: (editingTransaction as Investment).payment_method }),
          ...(type === 'withdrawal' && { withdrawal_method: (editingTransaction as Withdrawal).withdrawal_method }),
        })
        .eq('id', editingTransaction.id);

      if (error) throw error;

      // Update user balance if transaction is cancelled
      if (editingTransaction.is_cancelled && editingTransaction.status === 'cancelled') {
        const { error: balanceError } = await supabase
          .from('profiles')
          .update({
            available_balance: type === 'withdrawal' 
              ? editingTransaction.amount // Add back the amount if withdrawal is cancelled
              : -editingTransaction.amount // Subtract the amount if investment is cancelled
          })
          .eq('id', editingTransaction.user_id);

        if (balanceError) throw balanceError;
      }

      toast.success("Transaction mise à jour avec succès");
      onTransactionUpdated();
    } catch (error) {
      console.error('Error updating transaction:', error);
      toast.error("Erreur lors de la mise à jour de la transaction");
    }
  };

  const handleCancelTransaction = async () => {
    try {
      const table = type === 'investment' ? 'investments' : 'withdrawals';
      const { error } = await supabase
        .from(table)
        .update({
          is_cancelled: true,
          status: 'cancelled'
        })
        .eq('id', transaction.id);

      if (error) throw error;

      // Update user balance
      const { error: balanceError } = await supabase
        .from('profiles')
        .update({
          available_balance: type === 'withdrawal' 
            ? transaction.amount // Add back the amount if withdrawal is cancelled
            : -transaction.amount // Subtract the amount if investment is cancelled
        })
        .eq('id', transaction.user_id);

      if (balanceError) throw balanceError;

      toast.success("Transaction annulée avec succès");
      onTransactionUpdated();
    } catch (error) {
      console.error('Error cancelling transaction:', error);
      toast.error("Erreur lors de l'annulation de la transaction");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Modifier</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier la transaction</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Montant</Label>
            <Input
              type="number"
              value={editingTransaction.amount}
              onChange={(e) => setEditingTransaction({ ...editingTransaction, amount: parseFloat(e.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <Label>Statut</Label>
            <Select
              value={editingTransaction.status}
              onValueChange={(value) => setEditingTransaction({ ...editingTransaction, status: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="completed">Terminée</SelectItem>
                <SelectItem value="cancelled">Annulée</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {type === 'investment' && (
            <div className="space-y-2">
              <Label>Méthode de paiement</Label>
              <Select
                value={(editingTransaction as Investment).payment_method}
                onValueChange={(value) => setEditingTransaction({ ...editingTransaction, payment_method: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une méthode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="card">Carte bancaire</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="cash">Espèces</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          {type === 'withdrawal' && (
            <div className="space-y-2">
              <Label>Méthode de retrait</Label>
              <Select
                value={(editingTransaction as Withdrawal).withdrawal_method || ''}
                onValueChange={(value) => setEditingTransaction({ ...editingTransaction, withdrawal_method: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une méthode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank_transfer">Virement bancaire</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="flex justify-between">
            <Button onClick={handleUpdateTransaction}>Enregistrer</Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Annuler la transaction</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action est irréversible. La transaction sera marquée comme annulée 
                    {type === 'withdrawal' ? " et le montant sera recrédité sur le compte du client." : " et le montant sera débité du compte du client."}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Retour</AlertDialogCancel>
                  <AlertDialogAction onClick={handleCancelTransaction}>
                    Confirmer l'annulation
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};