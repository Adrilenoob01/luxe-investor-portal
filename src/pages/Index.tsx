import { Header } from "@/components/Header";
import { InvestmentPack } from "@/components/InvestmentPack";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Investissez dans le <span className="gradient-text">Luxe</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Participez au financement des commandes de vêtements de luxe et recevez des dividendes attractifs. Une nouvelle façon d'investir dans un marché en pleine croissance.
        </p>
        <Button size="lg" className="text-lg px-8">
          Commencer maintenant
        </Button>
      </section>

      {/* Investment Packs Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Nos Packs d'Investissement</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <InvestmentPack
              title="Pack Découverte"
              minAmount={1000}
              returnRate={8}
              description="Idéal pour débuter. Investissez dans une sélection de commandes premium avec un rendement attractif."
            />
            <InvestmentPack
              title="Pack Premium"
              minAmount={5000}
              returnRate={12}
              description="Accédez à des opportunités exclusives et bénéficiez d'un rendement optimisé sur vos investissements."
            />
            <InvestmentPack
              title="Pack Elite"
              minAmount={10000}
              returnRate={15}
              description="Pour les investisseurs avertis. Maximisez vos gains avec les meilleures opportunités du marché."
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Pourquoi nous choisir ?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="text-primary text-4xl mb-4">💎</div>
            <h3 className="text-xl font-semibold mb-3">Marché du Luxe</h3>
            <p className="text-gray-600">Investissez dans un secteur en croissance continue avec des marges attractives.</p>
          </div>
          <div className="text-center p-6">
            <div className="text-primary text-4xl mb-4">📈</div>
            <h3 className="text-xl font-semibold mb-3">Rendements Attractifs</h3>
            <p className="text-gray-600">Bénéficiez de rendements supérieurs aux placements traditionnels.</p>
          </div>
          <div className="text-center p-6">
            <div className="text-primary text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold mb-3">Sécurité Maximale</h3>
            <p className="text-gray-600">Vos investissements sont sécurisés et suivis en temps réel.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;