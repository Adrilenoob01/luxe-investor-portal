import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [loading, setLoading] = useState(false);

  const packData = location.state;

  useEffect(() => {
    if (!packData) {
      navigate("/");
      return;
    }

    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
      }
    };
    checkAuth();
  }, [packData, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        throw new Error("Non authentifié");
      }

      const numAmount = parseFloat(amount);
      if (numAmount < packData.minAmount) {
        throw new Error(`Le montant minimum est de ${packData.minAmount}€`);
      }

      const { error } = await supabase
        .from("investments")
        .insert({
          user_id: session.user.id,
          amount: numAmount,
          payment_method: paymentMethod,
        });

      if (error) throw error;

      toast({
        title: "Investissement réussi",
        description: "Votre investissement a été enregistré avec succès.",
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!packData) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-md mx-auto p-6">
          <h1 className="text-2xl font-bold mb-6">Finaliser votre investissement</h1>
          
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">{packData.packTitle}</h2>
            <p className="text-gray-600">
              Rendement: +{packData.returnRate}%
            </p>
            <p className="text-gray-600">
              Montant minimum: {packData.minAmount}€
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                Montant à investir (€)
              </label>
              <Input
                id="amount"
                type="number"
                min={packData.minAmount}
                step="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={`Minimum ${packData.minAmount}€`}
              />
            </div>

            <div>
              <label htmlFor="payment-method" className="block text-sm font-medium text-gray-700 mb-1">
                Moyen de paiement
              </label>
              <Select required onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un moyen de paiement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="card">Carte bancaire</SelectItem>
                  <SelectItem value="transfer">Virement bancaire</SelectItem>
                  <SelectItem value="crypto">Crypto-monnaie</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Traitement en cours..." : "Confirmer l'investissement"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default PaymentPage;