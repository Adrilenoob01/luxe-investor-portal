
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { OrderProject } from "@/types/supabase";
import { PaymentForm } from "@/components/payment/PaymentForm";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Payment() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [packs, setPacks] = useState<OrderProject[]>([]);
  const [selectedPack, setSelectedPack] = useState<OrderProject | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      try {
        await checkAuth();
        await fetchPacks();
      } catch (error) {
        console.error('Error initializing payment page:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
    
    // Check for success or cancelled payment
    if (searchParams.get('success') === 'true') {
      toast.success(
        "Merci de votre confiance ! Votre investissement va être traité par nos équipes et ajouté à votre compte d'ici 24h. Si ce n'est pas le cas, merci de nous contacter à contact@wearshops.fr en fournissant une preuve de paiement ainsi que les informations de votre compte client afin que nos équipes puissent traiter votre investissement.",
        {
          duration: Infinity,
          action: {
            label: "D'accord !",
            onClick: () => {
              navigate('/dashboard');
            },
          },
        }
      );
    } else if (searchParams.get('cancelled') === 'true') {
      toast.error("Paiement annulé");
    }
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast.error("Vous devez être connecté pour investir");
      navigate('/login');
      throw new Error("Not authenticated");
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
      throw error;
    }
  };

  const handlePackSelect = (packId: string) => {
    const pack = packs.find(p => p.id === packId);
    setSelectedPack(pack || null);
    if (pack) {
      setAmount(pack.min_amount);
    }
  };

  const getRemainingAmount = () => {
    if (!selectedPack) return 0;
    return selectedPack.target_amount - selectedPack.collected_amount;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-6">Investir dans un projet</h1>
          
          <PaymentForm
            packs={packs}
            onPackSelect={handlePackSelect}
            selectedPack={selectedPack}
            amount={amount}
            setAmount={setAmount}
            isProcessing={isProcessing}
            getRemainingAmount={getRemainingAmount}
          />
        </Card>
      </div>
    </div>
  );
}
