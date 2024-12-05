import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const Header = () => {
  return (
    <header className="w-full border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold gradient-text">LuxInvest</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-secondary hover:text-primary transition-colors">
            Accueil
          </Link>
          <Link to="/packs" className="text-secondary hover:text-primary transition-colors">
            Packs
          </Link>
          <Link to="/about" className="text-secondary hover:text-primary transition-colors">
            À propos
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          <Link to="/login">
            <Button variant="outline">Connexion</Button>
          </Link>
          <Link to="/register">
            <Button>S'inscrire</Button>
          </Link>
        </div>
      </div>
    </header>
  );
};