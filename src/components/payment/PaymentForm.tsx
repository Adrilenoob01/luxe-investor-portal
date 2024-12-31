import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrderProject } from "@/types/supabase";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PaymentFormProps {
  packs: OrderProject[];
  onPackSelect: (packId: string) => void;
  selectedPack: OrderProject | null;
  amount: number;
  setAmount: (amount: number) => void;
  isProcessing: boolean;
  getRemainingAmount: () => number;
}

export const PaymentForm = ({
  packs,
  onPackSelect,
  selectedPack,
  amount,
  setAmount,
  isProcessing,
  getRemainingAmount,
}: PaymentFormProps) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const isAmountValid = () => {
    if (!selectedPack) return false;
    const remainingAmount = getRemainingAmount();
    return amount >= selectedPack.min_amount && amount <= remainingAmount;
  };

  const handleProceedClick = () => {
    console.log("Opening confirmation dialog");
    if (isAmountValid()) {
      setShowConfirmDialog(true);
    }
  };

  const handleCashPayment = () => {
    toast.info(
      "Pour tout investissement en espèce sur une de nos commandes, merci de contacter nos équipes à contact.wearshop@gmail.com et nous serons ravis de procéder à votre investissement !",
      {
        duration: 10000,
      }
    );
  };

  const handleConfirmInvestment = async () => {
    try {
      if (!selectedPack || !isAmountValid()) return;

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Vous devez être connecté pour investir");
        return;
      }

      const { data, error } = await supabase.functions.invoke('create-stripe-session', {
        body: {
          amount: amount,
          projectId: selectedPack.id,
          projectName: selectedPack.name,
        }
      });

      if (error) throw error;
      if (!data.url) throw new Error("No checkout URL received");

      window.location.href = data.url;
    } catch (error) {
      console.error('Error creating Stripe session:', error);
      toast.error("Erreur lors de la création de la session de paiement");
    } finally {
      setShowConfirmDialog(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="pack">Sélectionnez un projet d'investissement</Label>
        <Select onValueChange={onPackSelect}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez un projet" />
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

      {selectedPack && (
        <>
          <div>
            <Label htmlFor="amount">Montant à investir (€)</Label>
            <Input
              id="amount"
              type="number"
              min={selectedPack.min_amount}
              max={getRemainingAmount()}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
            <p className="text-sm text-muted-foreground mt-1">
              Montant minimum : {selectedPack.min_amount}€
              <br />
              Montant restant à collecter : {getRemainingAmount()}€
            </p>
          </div>

          {!isAmountValid() && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Le montant doit être compris entre {selectedPack.min_amount}€ et {getRemainingAmount()}€
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-4">
            <Button 
              onClick={handleProceedClick}
              disabled={!isAmountValid() || isProcessing}
              className="flex-1"
            >
              Procéder à l'investissement
            </Button>
            <Button
              variant="outline"
              onClick={handleCashPayment}
              className="flex-1"
            >
              Je paye en espèces
            </Button>
          </div>

          <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirmer votre investissement</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="text-center space-y-2">
                  <p className="font-semibold">Montant : {amount}€</p>
                  <p className="text-sm text-muted-foreground">
                    Projet : {selectedPack.name}
                  </p>
                </div>

                <Alert className="bg-muted">
                  <AlertDescription className="text-sm">
                    Une fois que votre paiement sera accepté, votre investissement sera traité par nos équipes et ajouté à votre compte d'ici 24h. Si ce n'est pas le cas, merci de nous contacter à contact.wearshop@gmail.com en fournissant une preuve de paiement ainsi que les informations de votre compte client afin que nos équipes puissent traiter votre investissement.
                  </AlertDescription>
                </Alert>

                <Button 
                  onClick={handleConfirmInvestment}
                  disabled={isProcessing}
                  className="w-full"
                >
                  Confirmer et payer
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
};