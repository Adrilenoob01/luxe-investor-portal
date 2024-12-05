import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { InvestmentPack } from "@/components/InvestmentPack";
import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/Header";

const Index = () => {
  const { data: packs, isLoading } = useQuery({
    queryKey: ['investment-packs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('investment_packs')
        .select('*')
        .eq('is_active', true);
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">WearShop Invest</h1>
          <p className="text-xl text-gray-600 mb-8">
            Investissez dans le luxe, récoltez les bénéfices
          </p>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Notre plateforme vous permet d'investir dans des collections de vêtements de luxe
            et de bénéficier de rendements attractifs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-[200px] w-full" />
              </div>
            ))
          ) : packs?.length === 0 ? (
            <p className="text-center col-span-full text-gray-500">
              Aucun pack d'investissement disponible pour le moment.
            </p>
          ) : (
            packs?.map((pack) => (
              <InvestmentPack
                key={pack.id}
                title={pack.name}
                minAmount={pack.min_amount}
                returnRate={pack.return_rate}
                description="Investissez dans le luxe et bénéficiez de rendements attractifs."
              />
            ))
          )}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Pourquoi choisir WearShop Invest ?</h2>
          <div className="grid md:grid-cols-3 gap-8 mt-8">
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">
                <span role="img" aria-label="chart" className="mr-2">📈</span>
                Rendements Attractifs
              </h3>
              <p className="text-gray-600">
                Des rendements optimisés grâce à notre expertise du marché du luxe.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">
                <span role="img" aria-label="shield" className="mr-2">🛡️</span>
                Sécurité
              </h3>
              <p className="text-gray-600">
                Vos investissements sont sécurisés et gérés par des professionnels.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">
                <span role="img" aria-label="handshake" className="mr-2">🤝</span>
                Flexibilité
              </h3>
              <p className="text-gray-600">
                Choisissez le pack qui correspond le mieux à vos besoins.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;