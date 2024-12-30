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
import { PayPalButtons } from "@paypal/react-paypal-js";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface PaymentFormProps {
  packs: OrderProject[];
  onPackSelect: (packId: string) => void;
  selectedPack: OrderProject | null;
  amount: number;
  setAmount: (amount: number) => void;
  isProcessing: boolean;
  getRemainingAmount: () => number;
  createInvestment: (details: any) => Promise<void>;
}

export const PaymentForm = ({
  packs,
  onPackSelect,
  selectedPack,
  amount,
  setAmount,
  isProcessing,
  getRemainingAmount,
  createInvestment,
}: PaymentFormProps) => {
  const [paypalError, setPaypalError] = useState<string | null>(null);
  const [showPaypalDialog, setShowPaypalDialog] = useState(false);

  const isAmountValid = () => {
    if (!selectedPack) return false;
    const remainingAmount = getRemainingAmount();
    return amount >= selectedPack.min_amount && amount <= remainingAmount;
  };

  const handleProceedClick = () => {
    console.log("Opening PayPal dialog");
    if (isAmountValid()) {
      setShowPaypalDialog(true);
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

          <Button 
            onClick={handleProceedClick}
            disabled={!isAmountValid() || isProcessing}
            className="w-full"
          >
            Procéder à l'investissement
          </Button>

          <Dialog open={showPaypalDialog} onOpenChange={setShowPaypalDialog}>
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

                {paypalError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{paypalError}</AlertDescription>
                  </Alert>
                )}

                <PayPalButtons
                  style={{ layout: "vertical" }}
                  disabled={isProcessing}
                  createOrder={(data, actions) => {
                    console.log("Creating PayPal order");
                    if (!isAmountValid()) {
                      return Promise.reject(new Error("Montant invalide"));
                    }
                    return actions.order.create({
                      intent: "CAPTURE",
                      purchase_units: [
                        {
                          amount: {
                            value: amount.toString(),
                            currency_code: "EUR"
                          },
                          description: `Investissement - ${selectedPack.name}`
                        }
                      ]
                    });
                  }}
                  onApprove={async (data, actions) => {
                    console.log("PayPal order approved");
                    if (actions.order) {
                      const details = await actions.order.capture();
                      await createInvestment(details);
                      setShowPaypalDialog(false);
                    }
                  }}
                  onError={(err) => {
                    console.error("PayPal Error:", err);
                    setPaypalError("Une erreur est survenue avec PayPal. Veuillez réessayer plus tard.");
                  }}
                />
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
};