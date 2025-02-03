import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { User } from "lucide-react";

export const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <img
                src="/lovable-uploads/d3d10ae7-bd96-486f-b4fb-4c0a9810ac96.png"
                alt="Logo"
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
              <Link
                to="/newsletter"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
              >
                Newsletter
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center space-x-2 text-sm font-medium text-gray-500 hover:text-gray-900"
                >
                  <User className="h-5 w-5" />
                  <span>Mon compte</span>
                </Link>
                <button
                  onClick={logout}
                  className="text-sm font-medium text-gray-500 hover:text-gray-900"
                >
                  Déconnexion
                </button>
              </>
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