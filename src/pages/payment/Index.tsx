import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { OrderProject } from "@/types/supabase";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { PaymentForm } from "@/components/payment/PaymentForm";

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
        .eq('status', 'collecting')
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
      setAmount(pack.min_amount);
    }
  };

  const createInvestment = async (paymentDetails: any) => {
    try {
      setIsProcessing(true);
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
          status: 'completed'
        });

      if (error) throw error;

      toast.success("Investissement enregistré avec succès");
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating investment:', error);
      toast.error("Erreur lors de la création de l'investissement");
    } finally {
      setIsProcessing(false);
    }
  };

  const getRemainingAmount = () => {
    if (!selectedPack) return 0;
    return selectedPack.target_amount - selectedPack.collected_amount;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Card className="max-w-md mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Investir</h1>
        
        <PayPalScriptProvider options={{ 
          clientId: "test",
          currency: "EUR",
          intent: "CAPTURE"
        }}>
          <PaymentForm
            packs={packs}
            onPackSelect={handlePackSelect}
            selectedPack={selectedPack}
            amount={amount}
            setAmount={setAmount}
            isProcessing={isProcessing}
            getRemainingAmount={getRemainingAmount}
            createInvestment={createInvestment}
          />
        </PayPalScriptProvider>
      </Card>
    </div>
  );
}