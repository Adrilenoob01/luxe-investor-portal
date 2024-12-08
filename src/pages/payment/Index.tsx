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
import { InvestmentPack } from "@/types/supabase";

export default function Payment() {
  const navigate = useNavigate();
  const [packs, setPacks] = useState<InvestmentPack[]>([]);
  const [selectedPack, setSelectedPack] = useState<InvestmentPack | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>("");

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
        .from('investment_packs')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;
      setPacks(data);
    } catch (error) {
      console.error('Error fetching packs:', error);
      toast.error("Erreur lors du chargement des packs d'investissement");
    }
  };

  const handlePackSelect = (packId: string) => {
    const pack = packs.find(p => p.id === packId);
    setSelectedPack(pack || null);
    if (pack) {
      setAmount(pack.min_amount);
    }
  };

  const handleInvest = async () => {
    try {
      if (!selectedPack) {
        toast.error("Veuillez sélectionner un pack d'investissement");
        return;
      }

      if (amount < selectedPack.min_amount) {
        toast.error(`Le montant minimum pour ce pack est de ${selectedPack.min_amount}€`);
        return;
      }

      if (!paymentMethod) {
        toast.error("Veuillez sélectionner une méthode de paiement");
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/login');
        return;
      }

      const { error } = await supabase
        .from('investments')
        .insert({
          user_id: session.user.id,
          pack_id: selectedPack.id,
          amount: amount,
          payment_method: paymentMethod,
          status: 'pending'
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
                    {pack.name} - Min: {pack.min_amount}€ ({pack.return_rate}% de rendement)
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
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value))}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Montant minimum : {selectedPack.min_amount}€
                </p>
              </div>

              <div>
                <Label htmlFor="paymentMethod">Méthode de paiement</Label>
                <Select onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une méthode de paiement" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="card">Carte bancaire</SelectItem>
                    <SelectItem value="transfer">Virement bancaire</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleInvest} className="w-full">
                Investir maintenant
              </Button>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}