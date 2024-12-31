import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Register = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        navigate("/dashboard");
      }
    };
    checkUser();
  }, [navigate]);

  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <Card className="w-full max-w-md p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-center">Créer un compte</h1>
          <p className="text-center text-muted-foreground">
            Commencez à investir dans le luxe dès aujourd&apos;hui
          </p>
        </div>

        <Auth
          supabaseClient={supabase}
          view="sign_up"
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: "#000000",
                  brandAccent: "#666666",
                },
              },
            },
          }}
          localization={{
            variables: {
              sign_up: {
                email_label: "Adresse email",
                password_label: "Mot de passe",
                button_label: "Créer un compte",
                loading_button_label: "Création en cours...",
                social_provider_text: "Se connecter avec {{provider}}",
                link_text: "Vous n&apos;avez pas de compte ? Inscrivez-vous",
              },
            },
          }}
          theme="light"
          providers={[]}
          redirectTo={`${window.location.origin}/dashboard`}
        />

        <div className="text-center text-sm text-muted-foreground">
          <p className="mt-4">
            En créant un compte, vous acceptez nos{" "}
            <a href="#" className="underline">
              conditions d&apos;utilisation
            </a>{" "}
            et notre{" "}
            <a href="#" className="underline">
              politique de confidentialité
            </a>
            .
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Register;