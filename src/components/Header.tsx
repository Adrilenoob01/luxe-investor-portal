import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Header = () => {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="w-full border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold gradient-text">LuxInvest</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-secondary-foreground hover:text-primary transition-colors">
            Accueil
          </Link>
          <Link to="/packs" className="text-secondary-foreground hover:text-primary transition-colors">
            Packs
          </Link>
          <Link to="/about" className="text-secondary-foreground hover:text-primary transition-colors">
            À propos
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          {session ? (
            <>
              <Link to="/dashboard">
                <Button variant="outline">Mon compte</Button>
              </Link>
              <Button onClick={handleLogout}>Déconnexion</Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline">Connexion</Button>
              </Link>
              <Link to="/register">
                <Button>S'inscrire</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};