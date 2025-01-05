import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Profile, OrderProject } from "@/types/supabase";

interface CreateTransactionDialogProps {
  user: Profile;
  packs: OrderProject[];
  onTransactionCreated: () => void;
}

export const CreateTransactionDialog = ({ user, packs, onTransactionCreated }: CreateTransactionDialogProps) => {
  const [transactionType, setTransactionType] = useState<'investment' | 'withdrawal'>('investment');
  const [amount, setAmount] = useState<number>(0);
  const [selectedPack, setSelectedPack] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('');

  const handleCreateTransaction = async () => {
    try {
      if (transactionType === 'investment') {
        if (!selectedPack) {
          toast.error("Veuillez sélectionner une commande");
          return;
        }

        if (!paymentMethod) {
          toast.error("Veuillez sélectionner une méthode de paiement");
          return;
        }

        const { error: investmentError } = await supabase
          .from('investments')
          .insert({
            user_id: user.id,
            project_id: selectedPack,
            amount: amount,
            payment_method: paymentMethod,
            status: 'completed'
          });

        if (investmentError) throw investmentError;

        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            invested_amount: user.invested_amount + amount,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id);

        if (updateError) throw updateError;

      } else {
        const { error: withdrawalError } = await supabase
          .from('withdrawals')
          .insert({
            user_id: user.id,
            amount: amount,
            status: 'completed'
          });

        if (withdrawalError) throw withdrawalError;

        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            available_balance: user.available_balance - amount,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id);

        if (updateError) throw updateError;
      }

      toast.success("Transaction créée avec succès");
      onTransactionCreated();
    } catch (error) {
      console.error('Error creating transaction:', error);
      toast.error("Erreur lors de la création de la transaction");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Créer une transaction</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Créer une nouvelle transaction</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Type de transaction</Label>
            <Select onValueChange={(value: 'investment' | 'withdrawal') => setTransactionType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez le type de transaction" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="investment">Investissement</SelectItem>
                <SelectItem value="withdrawal">Retrait</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {transactionType === 'investment' && (
            <div>
              <Label>Commande</Label>
              <Select onValueChange={setSelectedPack}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une commande" />
                </SelectTrigger>
                <SelectContent>
                  {packs.map((pack) => (
                    <SelectItem key={pack.id} value={pack.id}>
                      {pack.name} - Min: {pack.min_amount}€
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label>Montant</Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
            />
          </div>

          {transactionType === 'investment' && (
            <div>
              <Label>Méthode de paiement</Label>
              <Select onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une méthode de paiement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="card">Carte bancaire</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="cash">Espèces</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <Button onClick={handleCreateTransaction}>
            Créer la transaction
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};