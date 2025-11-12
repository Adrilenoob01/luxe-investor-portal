import { Construction } from "lucide-react";

export default function Maintenance() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8 flex justify-center">
          <Construction className="w-24 h-24 text-primary" />
        </div>

        <h1 className="text-4xl font-bold mb-4 text-foreground">Suspension temporaire des activités de WearShop</h1>

        <div className="bg-card p-8 rounded-lg shadow-lg border border-border">
          <p className="text-lg text-muted-foreground mb-6">
            Chers investisseurs, C’est avec une grande tristesse que nous vous annonçons la suspension immédiate des
            activités de WearShop. En effet, l’un de nos colis a récemment été saisi par les services de douane dans le
            cadre d’un contrôle lié à l’importation de produits destinés à la revente non professionnelle. Cette
            situation entraîne pour le moment une interruption de nos opérations, le temps que nous obtenions davantage
            d’informations sur la suite de la procédure (éventuelle enquête, démarches administratives, intervention de
            l’assurance, etc.). En conséquence, tous les versements sont temporairement suspendus, dans l’attente d’un
            dénouement clair et sécurisé pour l’ensemble de nos investisseurs. Nous comprenons parfaitement les
            inquiétudes que cela peut susciter et tenons à vous assurer que tout sera mis en œuvre pour régulariser la
            situation dans les meilleurs délais. Nous vous remercions sincèrement pour votre patience, votre
            compréhension et la confiance que vous avez accordée à WearShop depuis le début de cette aventure. Dès que
            de nouvelles informations seront disponibles, une communication officielle sera publiée afin de vous tenir
            informés de la suite des événements. 
            Avec tout notre respect et notre gratitude, L’équipe WearShop</p>
          </p>

          <div className="bg-muted/50 p-6 rounded-md">
            <p className="text-foreground font-medium mb-2">Nous reviendrons très bientôt !</p>
            <p className="text-sm text-muted-foreground">
              Pour toute question urgente, contactez-nous à : contact@wearshops.fr
            </p>
          </div>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">© 2024 WearShop Invest. Tous droits réservés.</p>
      </div>
    </div>
  );
}
