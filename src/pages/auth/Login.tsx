
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Check if user is already logged in
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_IN" && session) {
      // Afficher un message de succès
      toast.success("Connexion réussie !");
      navigate("/dashboard");
    } else if (event === "SIGNED_OUT") {
      // Rediriger vers la page de connexion si déconnecté
      navigate("/login");
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold gradient-text">WearShop Invest</h1>
          <p className="text-muted-foreground">Connectez-vous à votre compte</p>
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
            }
          }}
          localization={{
            variables: {
              sign_in: {
                email_label: 'Adresse email',
                password_label: 'Mot de passe',
                button_label: 'Se connecter',
                loading_button_label: 'Connexion en cours...',
                social_provider_text: 'Continuer avec {{provider}}',
                link_text: "Vous avez déjà un compte ? Connectez-vous",
              },
              sign_up: {
                email_label: 'Adresse email',
                password_label: 'Mot de passe',
                button_label: "S'inscrire",
                loading_button_label: 'Inscription en cours...',
                social_provider_text: 'Continuer avec {{provider}}',
                link_text: "Vous n'avez pas de compte ? Inscrivez-vous",
              },
              forgotten_password: {
                email_label: 'Adresse email',
                password_label: 'Mot de passe',
                button_label: 'Envoyer les instructions',
                loading_button_label: 'Envoi en cours...',
                link_text: 'Mot de passe oublié ?',
              },
            },
          }}
          theme="light"
          providers={[]}
          onError={(error) => {
            console.error('Erreur d\'authentification:', error);
            if (error.message.includes('Invalid login credentials')) {
              toast.error('Email ou mot de passe incorrect');
            } else if (error.message.includes('Email not confirmed')) {
              toast.error('Veuillez confirmer votre email avant de vous connecter');
            } else {
              toast.error('Une erreur est survenue lors de la connexion');
            }
          }}
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
