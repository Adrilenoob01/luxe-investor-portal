import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { InvestmentPack } from "@/components/InvestmentPack";
import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/Header";
import { OrderProject } from "@/types/supabase";
import { Clock, ShieldCheck, DollarSign } from "lucide-react";

const Index = () => {
  const { data: projects, isLoading } = useQuery({
    queryKey: ['latest-projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('order_projects')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (error) throw error;
      return data as OrderProject[];
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
            Investissez dans des commandes de vêtements de luxe afin d'en récolter les dividendes.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-[200px] w-full" />
              </div>
            ))
          ) : projects?.length === 0 ? (
            <p className="text-center col-span-full text-gray-500">
              Aucun projet d'investissement disponible pour le moment.
            </p>
          ) : (
            projects?.map((project) => (
              <InvestmentPack
                key={project.id}
                title={project.name}
                minAmount={project.min_amount}
                targetAmount={project.target_amount}
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

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-8">Pourquoi choisir WearShop Invest ?</h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">
                <span role="img" aria-label="chart" className="mr-2">📈</span>
                Rendements Attractifs
              </h3>
              <p className="text-gray-600">
                De forts rendements obtenus par un marché en pleine expansion.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">
                <span role="img" aria-label="shield" className="mr-2">🛡️</span>
                Sécurité
              </h3>
              <p className="text-gray-600">
                Vos investissements sont sécurisés et visibles en temps réel.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">
                <span role="img" aria-label="handshake" className="mr-2">🤝</span>
                Flexibilité
              </h3>
              <p className="text-gray-600">
                Choisissez le projet qui correspond le mieux à vos objectifs.
              </p>
            </div>
          </div>

          {/* Statistiques clés */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <Clock className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-primary mb-2">45 Jours</h3>
              <p className="text-gray-600">Durée moyenne d'investissement</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <DollarSign className="w-12 h-12 text-success-DEFAULT mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-success-DEFAULT mb-2">15-20%</h3>
              <p className="text-gray-600">Rendement moyen</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <ShieldCheck className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-primary mb-2">100%</h3>
              <p className="text-gray-600">Articles authentiques garantis</p>
            </div>
          </div>
        </div>

        <footer className="bg-white mt-16 py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-semibold text-lg mb-4">À propos</h4>
              <p className="text-gray-600">
                WearShop Invest est une plateforme innovante permettant d'investir dans le marché du luxe.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-4">Contact</h4>
              <p className="text-gray-600">
                Email: contact@wearshops.fr
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-4">Mentions légales</h4>
              <p className="text-gray-600">
                © 2024 WearShop Invest. Tous droits réservés.
              </p>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="text-center max-w-3xl mx-auto">
              <p className="text-amber-700 font-medium mb-2">⚠️ Avertissement sur les risques</p>
              <p className="text-gray-600 text-sm">
                Tout investissement comporte des risques de perte en capital. Il est important de ne jamais investir plus que ce que vous êtes prêt à perdre. Nous vous recommandons d'évaluer soigneusement votre situation financière et vos objectifs avant de prendre toute décision d'investissement.
              </p>
            </div>
          </div>
        </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
