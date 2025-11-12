import { Construction } from "lucide-react";

export default function Maintenance() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8 flex justify-center">
          <Construction className="w-24 h-24 text-primary" />
        </div>
        
        <h1 className="text-4xl font-bold mb-4 text-foreground">
          Site en maintenance
        </h1>
        
        <div className="bg-card p-8 rounded-lg shadow-lg border border-border">
          <p className="text-lg text-muted-foreground mb-6">
            Notre site est actuellement en maintenance pour améliorer votre expérience.
          </p>
          
          <div className="bg-muted/50 p-6 rounded-md">
            <p className="text-foreground font-medium mb-2">
              Nous reviendrons très bientôt !
            </p>
            <p className="text-sm text-muted-foreground">
              Pour toute question urgente, contactez-nous à : contact@wearshops.fr
            </p>
          </div>
        </div>
        
        <p className="mt-8 text-sm text-muted-foreground">
          © 2024 WearShop Invest. Tous droits réservés.
        </p>
      </div>
    </div>
  );
}
