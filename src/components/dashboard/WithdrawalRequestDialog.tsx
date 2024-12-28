import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface WithdrawalRequestDialogProps {
  availableBalance: number;
  onRequestSubmitted: () => void;
}

export const WithdrawalRequestDialog = ({ availableBalance, onRequestSubmitted }: WithdrawalRequestDialogProps) => {
  const [amount, setAmount] = useState<number>(0);
  const [withdrawalMethod, setWithdrawalMethod] = useState<string>("");

  const handleSubmitRequest = async () => {
    try {
      if (amount <= 0 || amount > availableBalance) {
        toast.error("Montant invalide");
        return;
      }

      if (!withdrawalMethod) {
        toast.error("Veuillez sélectionner une méthode de retrait");
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      const { error } = await supabase
        .from("withdrawals")
        .insert({
          user_id: user.id,
          amount: amount,
          withdrawal_method: withdrawalMethod,
          status: "pending"
        });

      if (error) throw error;

      toast.success("Demande de retrait soumise avec succès");
      onRequestSubmitted();
      setAmount(0);
      setWithdrawalMethod("");
    } catch (error) {
      console.error("Error submitting withdrawal request:", error);
      toast.error("Erreur lors de la soumission de la demande");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled={availableBalance <= 0}>
          Demander un retrait
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Demande de retrait</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Montant à retirer</Label>
            <Input
              type="number"
              min={0}
              max={availableBalance}
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
            />
            <p className="text-sm text-gray-500 mt-1">
              Solde disponible: {availableBalance}€
            </p>
          </div>
          <div>
            <Label>Méthode de retrait</Label>
            <Select onValueChange={setWithdrawalMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez une méthode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bank_transfer">Virement bancaire</SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleSubmitRequest}>
            Soumettre la demande
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};