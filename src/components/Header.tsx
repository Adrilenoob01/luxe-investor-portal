import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <img 
                src="/lovable-uploads/4c6840e4-a868-4549-b148-6e871b338b7c.png" 
                alt="WearShop Invest Logo" 
                className="h-8 w-auto"
              />
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
              >
                Accueil
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
              >
                À propos
              </Link>
              {user && (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
                >
                  Mon compte
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center">
            {user ? (
              <button
                onClick={logout}
                className="text-sm font-medium text-gray-500 hover:text-gray-900"
              >
                Déconnexion
              </button>
            ) : (
              <Link
                to="/login"
                className="text-sm font-medium text-gray-500 hover:text-gray-900"
              >
                Connexion
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};