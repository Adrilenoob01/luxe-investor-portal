import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { InvestmentPack } from "@/components/InvestmentPack";
import { Skeleton } from "@/components/ui/skeleton";

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
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">WearShop Invest</h1>
          <p className="text-xl text-gray-600">
            Investissez dans le luxe, récoltez les bénéfices
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            // Loading skeletons
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
      </div>
    </div>
  );
};

export default Index;