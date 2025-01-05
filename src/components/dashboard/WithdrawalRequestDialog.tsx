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
  const [bankInfo, setBankInfo] = useState({
    iban: "",
    firstName: "",
    lastName: "",
    address: "",
    phone: "",
  });
  const [open, setOpen] = useState(false);

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

      if (withdrawalMethod === "bank_transfer") {
        if (amount < 9.5) {
          toast.error("Le montant minimum pour un retrait par virement est de 9,50€");
          return;
        }

        if (!bankInfo.iban || !bankInfo.firstName || !bankInfo.lastName || !bankInfo.address || !bankInfo.phone) {
          toast.error("Veuillez remplir toutes les informations bancaires");
          return;
        }
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      const fees = withdrawalMethod === "bank_transfer" ? 0.5 : 0;
      const netAmount = amount - fees;

      const { error } = await supabase
        .from("withdrawals")
        .insert({
          user_id: user.id,
          amount: amount,
          withdrawal_method: withdrawalMethod,
          status: "pending",
          fees: fees,
          ...(withdrawalMethod === "bank_transfer" && {
            iban: bankInfo.iban,
            phone_number: bankInfo.phone,
          }),
        });

      if (error) throw error;

      if (withdrawalMethod === "bank_transfer") {
        const { error: emailError } = await supabase.functions.invoke("send-withdrawal-email", {
          body: {
            firstName: bankInfo.firstName,
            lastName: bankInfo.lastName,
            address: bankInfo.address,
            phone: bankInfo.phone,
            iban: bankInfo.iban,
            amount: amount,
            netAmount: netAmount,
          },
        });

        if (emailError) {
          console.error("Error sending email:", emailError);
          toast.error("La demande a été enregistrée mais l'email n'a pas pu être envoyé");
        }
      }

      toast.success("Demande de retrait soumise avec succès");
      onRequestSubmitted();
      setOpen(false);
      setAmount(0);
      setWithdrawalMethod("");
      setBankInfo({
        iban: "",
        firstName: "",
        lastName: "",
        address: "",
        phone: "",
      });
    } catch (error) {
      console.error("Error submitting withdrawal request:", error);
      toast.error("Erreur lors de la soumission de la demande");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={availableBalance <= 0}>
          Demander un retrait
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
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
            <Select onValueChange={setWithdrawalMethod} value={withdrawalMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez une méthode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bank_transfer">Virement bancaire (frais: 0,50€, minimum: 9,50€)</SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {withdrawalMethod === "bank_transfer" && (
            <>
              <div className="space-y-4">
                <div>
                  <Label>IBAN</Label>
                  <Input
                    value={bankInfo.iban}
                    onChange={(e) => setBankInfo({ ...bankInfo, iban: e.target.value })}
                    placeholder="FR76..."
                  />
                </div>
                <div>
                  <Label>Prénom</Label>
                  <Input
                    value={bankInfo.firstName}
                    onChange={(e) => setBankInfo({ ...bankInfo, firstName: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Nom</Label>
                  <Input
                    value={bankInfo.lastName}
                    onChange={(e) => setBankInfo({ ...bankInfo, lastName: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Adresse</Label>
                  <Input
                    value={bankInfo.address}
                    onChange={(e) => setBankInfo({ ...bankInfo, address: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Téléphone</Label>
                  <Input
                    value={bankInfo.phone}
                    onChange={(e) => setBankInfo({ ...bankInfo, phone: e.target.value })}
                    placeholder="+33..."
                  />
                </div>
                <p className="text-sm text-gray-500">
                  Montant net que vous recevrez : {amount > 0 ? (amount - 0.5).toFixed(2) : 0}€
                  <br />
                  (Montant demandé : {amount}€ - Frais : 0,50€)
                </p>
              </div>
            </>
          )}
          <Button onClick={handleSubmitRequest}>
            Soumettre la demande
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};