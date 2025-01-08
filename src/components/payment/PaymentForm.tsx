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
import { Switch } from "@/components/ui/switch";

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
  const [useBalance, setUseBalance] = useState(false);
  const [availableBalance, setAvailableBalance] = useState(0);

  // Fetch user's available balance
  const fetchUserBalance = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user?.id) return;

    const { data: profile } = await supabase
      .from('profiles')
      .select('available_balance')
      .eq('id', session.user.id)
      .single();

    if (profile) {
      setAvailableBalance(profile.available_balance);
    }
  };

  useState(() => {
    fetchUserBalance();
  }, []);

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
      "Pour tout investissement en espèce sur une de nos commandes, merci de contacter nos équipes à contact@wearshops.fr et nous serons ravis de procéder à votre investissement !",
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

      if (useBalance) {
        if (amount > availableBalance) {
          toast.error("Solde insuffisant");
          return;
        }

        // Create investment using balance
        const { error: investmentError } = await supabase
          .from('investments')
          .insert({
            user_id: session.user.id,
            project_id: selectedPack.id,
            amount: amount,
            payment_method: 'balance',
            status: 'completed'
          });

        if (investmentError) throw investmentError;

        // Update user's balance
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            available_balance: availableBalance - amount,
            invested_amount: amount,
            updated_at: new Date().toISOString(),
          })
          .eq('id', session.user.id);

        if (updateError) throw updateError;

        toast.success("Investissement effectué avec succès");
        setShowConfirmDialog(false);
        return;
      }

      // Regular Stripe payment flow
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
      console.error('Error processing investment:', error);
      toast.error("Erreur lors du traitement de l'investissement");
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

          {availableBalance > 0 && (
            <div className="flex items-center space-x-2">
              <Switch
                id="use-balance"
                checked={useBalance}
                onCheckedChange={setUseBalance}
              />
              <Label htmlFor="use-balance">
                Utiliser mon solde disponible ({availableBalance}€)
              </Label>
            </div>
          )}

          {!isAmountValid() && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Le montant doit être compris entre {selectedPack.min_amount}€ et {getRemainingAmount()}€
              </AlertDescription>
            </Alert>
          )}

          {useBalance && amount > availableBalance && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Le montant dépasse votre solde disponible ({availableBalance}€)
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-4">
            <Button 
              onClick={handleProceedClick}
              disabled={!isAmountValid() || isProcessing}
              className="flex-1"
            >
              {useBalance ? "Réinvestir mon solde" : "Procéder à l'investissement"}
            </Button>
            {!useBalance && (
              <Button
                variant="outline"
                onClick={handleCashPayment}
                className="flex-1"
              >
                Je paye en espèces
              </Button>
            )}
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
                  {useBalance && (
                    <p className="text-sm text-muted-foreground">
                      Méthode : Réinvestissement du solde disponible
                    </p>
                  )}
                </div>

                <Alert className="bg-muted">
                  <AlertDescription className="text-sm">
                    {useBalance ? (
                      "Votre solde disponible sera utilisé pour cet investissement. Le montant sera immédiatement déduit de votre solde."
                    ) : (
                      "Une fois que votre paiement sera accepté, votre investissement sera traité par nos équipes et ajouté à votre compte d'ici 24h. Si ce n'est pas le cas, merci de nous contacter à contact@wearshops.fr en fournissant une preuve de paiement ainsi que les informations de votre compte client afin que nos équipes puissent traiter votre investissement."
                    )}
                  </AlertDescription>
                </Alert>

                <Button 
                  onClick={handleConfirmInvestment}
                  disabled={isProcessing}
                  className="w-full"
                >
                  Confirmer {useBalance ? "le réinvestissement" : "et payer"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
};