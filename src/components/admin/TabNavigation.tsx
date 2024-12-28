import { Button } from "@/components/ui/button";

interface TabNavigationProps {
  activeTab: 'users' | 'packs' | 'transactions';
  onTabChange: (tab: 'users' | 'packs' | 'transactions') => void;
}

export const TabNavigation = ({ activeTab, onTabChange }: TabNavigationProps) => {
  return (
    <div className="flex space-x-4 mb-6">
      <Button
        variant={activeTab === 'users' ? 'default' : 'outline'}
        onClick={() => onTabChange('users')}
      >
        Utilisateurs
      </Button>
      <Button
        variant={activeTab === 'packs' ? 'default' : 'outline'}
        onClick={() => onTabChange('packs')}
      >
        Commandes
      </Button>
      <Button
        variant={activeTab === 'transactions' ? 'default' : 'outline'}
        onClick={() => onTabChange('transactions')}
      >
        Transactions
      </Button>
    </div>
  );
};