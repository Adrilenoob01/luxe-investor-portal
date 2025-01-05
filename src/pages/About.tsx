import { Header } from "@/components/Header";
import { Clock, ShieldCheck, DollarSign } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-12 text-center gradient-text">
            À propos de nous
          </h1>

          <div className="space-y-12">
            {/* Premier paragraphe */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <p className="text-lg leading-relaxed text-gray-700">
                Chez <span className="font-semibold text-primary">WearShop</span>, nous vous offrons une opportunité unique de tirer profit du marché du luxe grâce à notre système de 
                <span className="font-semibold"> financement participatif</span>. Vous avez l'opportunité d'investir dans des 
                <span className="font-semibold"> commandes de vêtements de luxe</span> soigneusement sélectionnés par nos experts auprès de fournisseurs de confiance. Tous nos articles sont 
                <span className="text-success-DEFAULT font-semibold"> certifiés et garantis authentiques</span>, assurant ainsi une qualité irréprochable.
              </p>
            </div>

            {/* Deuxième paragraphe */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <p className="text-lg leading-relaxed text-gray-700">
                Ces vêtements exclusifs sont ensuite revendus par nos équipes à un prix compétitif. En seulement 
                <span className="font-semibold text-primary"> 45 jours</span>, vous pouvez bénéficier d'un retour attractif de 
                <span className="font-semibold text-success-DEFAULT"> 15 à 20 %</span>, incluant votre capital initialement investi. Cette approche unique allie 
                <span className="font-semibold"> transparence, rendement et passion</span> pour la mode haut de gamme.
              </p>
            </div>

            {/* Statistiques clés */}
            <div className="grid md:grid-cols-3 gap-8 mt-12">
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
        </div>
      </main>

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
  );
};

export default About;
