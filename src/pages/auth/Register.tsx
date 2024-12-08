import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

export default function Register() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Check if user is already logged in
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_IN" && session) {
      navigate("/dashboard");
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold gradient-text">WearShop Invest</h1>
          <p className="text-muted-foreground">Créez votre compte investisseur</p>
        </div>

        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#0EA5E9',
                  brandAccent: '#0284C7',
                }
              }
            },
            className: {
              container: 'w-full',
              button: 'w-full px-4 py-2 bg-primary text-white rounded hover:bg-primary/90',
              input: 'w-full px-3 py-2 border rounded focus:ring-2 focus:ring-primary/20 focus:border-primary',
              label: 'block text-sm font-medium text-gray-700 mb-1',
            }
          }}
          localization={{
            variables: {
              sign_up: {
                email_label: 'Adresse email',
                password_label: 'Mot de passe',
                button_label: "S'inscrire",
                loading_button_label: 'Inscription en cours...',
                social_provider_text: 'Continuer avec {{provider}}',
                link_text: "Vous avez déjà un compte ? Connectez-vous",
              },
            },
          }}
          view="sign_up"
          theme="light"
          providers={[]}
          redirectTo={`${window.location.origin}/dashboard`}
        />

        <div className="text-center text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary">
            Retour à l'accueil
          </Link>
        </div>
      </Card>
    </div>
  );
}