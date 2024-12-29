import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrderProject } from "@/types/supabase";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export default function Payment() {
  const navigate = useNavigate();
  const [packs, setPacks] = useState<OrderProject[]>([]);
  const [selectedPack, setSelectedPack] = useState<OrderProject | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchPacks();
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/login');
    }
  };

  const fetchPacks = async () => {
    try {
      const { data, error } = await supabase
        .from('order_projects')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;
      setPacks(data);
    } catch (error) {
      console.error('Error fetching packs:', error);
      toast.error("Erreur lors du chargement des projets d'investissement");
    }
  };

  const handlePackSelect = (packId: string) => {
    const pack = packs.find(p => p.id === packId);
    setSelectedPack(pack || null);
    if (pack) {
      setAmount(pack.target_amount);
    }
  };

  const createInvestment = async (paymentDetails: any) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/login');
        return;
      }

      const { error } = await supabase
        .from('investments')
        .insert({
          user_id: session.user.id,
          project_id: selectedPack?.id,
          amount: amount,
          payment_method: 'paypal',
          status: 'completed',
          payment_details: paymentDetails
        });

      if (error) throw error;

      toast.success("Investissement enregistré avec succès");
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating investment:', error);
      toast.error("Erreur lors de la création de l'investissement");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Card className="max-w-md mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Investir</h1>
        
        <div className="space-y-6">
          <div>
            <Label htmlFor="pack">Pack d'investissement</Label>
            <Select onValueChange={handlePackSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un pack" />
              </SelectTrigger>
              <SelectContent>
                {packs.map((pack) => (
                  <SelectItem key={pack.id} value={pack.id}>
                    {pack.name} - Min: {pack.target_amount}€ ({pack.return_rate}% de rendement)
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
                  min={selectedPack.target_amount}
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value))}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Montant minimum : {selectedPack.target_amount}€
                </p>
              </div>

              <div className="space-y-4">
                <PayPalScriptProvider options={{ 
                  clientId: process.env.PAYPAL_CLIENT_ID || "test",
                  currency: "EUR",
                  intent: "CAPTURE"
                }}>
                  <PayPalButtons
                    disabled={isProcessing || amount < selectedPack.target_amount}
                    style={{ layout: "vertical" }}
                    createOrder={(data, actions) => {
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
                      setIsProcessing(true);
                      try {
                        const details = await actions.order?.capture();
                        await createInvestment(details);
                      } catch (error) {
                        console.error('Payment failed:', error);
                        toast.error("Le paiement a échoué. Veuillez réessayer.");
                      } finally {
                        setIsProcessing(false);
                      }
                    }}
                    onError={() => {
                      toast.error("Une erreur est survenue lors du paiement. Veuillez réessayer.");
                      setIsProcessing(false);
                    }}
                  />
                </PayPalScriptProvider>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}