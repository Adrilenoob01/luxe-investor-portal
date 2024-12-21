import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { OrderProject } from "@/types/supabase";
import { Header } from "@/components/Header";
import { InvestmentPack } from "@/components/InvestmentPack";

const OrdersPage = () => {
  const { data: projects, isLoading } = useQuery({
    queryKey: ['latest-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('order_projects')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data as OrderProject[];
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8">Dernières commandes</h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            <p>Chargement...</p>
          ) : projects?.length === 0 ? (
            <p>Aucune commande disponible.</p>
          ) : (
            projects?.map((project) => (
              <InvestmentPack
                key={project.id}
                title={project.name}
                minAmount={5}
                returnRate={project.return_rate}
                description={project.description}
                progress={(project.collected_amount / project.target_amount) * 100}
                imageUrl={project.image_url}
                shortDescription={project.short_description}
                location={project.location}
                category={project.category}
                implementationDate={project.implementation_date}
                endDate={project.end_date}
                status={project.status}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;