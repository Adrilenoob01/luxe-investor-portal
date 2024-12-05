import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'users' | 'packs' | 'transactions'>('users');

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAdminAuthenticated");
    if (!isAuthenticated) {
      navigate("/admin/login");
    }
  }, [navigate]);

  const { data: users } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
      if (error) throw error;
      return data;
    },
  });

  const { data: packs } = useQuery({
    queryKey: ['admin-packs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('investment_packs')
        .select('*');
      if (error) throw error;
      return data;
    },
  });

  const { data: transactions } = useQuery({
    queryKey: ['admin-transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('investments')
        .select(`
          *,
          profiles:user_id(first_name, last_name),
          investment_packs:pack_id(name)
        `);
      if (error) throw error;
      return data;
    },
  });

  const handleLogout = () => {
    localStorage.removeItem("isAdminAuthenticated");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Administration</h1>
            <Button variant="outline" onClick={handleLogout}>
              Déconnexion
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-4 mb-6">
          <Button
            variant={activeTab === 'users' ? 'default' : 'outline'}
            onClick={() => setActiveTab('users')}
          >
            Utilisateurs
          </Button>
          <Button
            variant={activeTab === 'packs' ? 'default' : 'outline'}
            onClick={() => setActiveTab('packs')}
          >
            Packs
          </Button>
          <Button
            variant={activeTab === 'transactions' ? 'default' : 'outline'}
            onClick={() => setActiveTab('transactions')}
          >
            Transactions
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          {activeTab === 'users' && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Prénom</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Adresse</TableHead>
                  <TableHead>Admin</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users?.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-mono">{user.id}</TableCell>
                    <TableCell>{user.first_name}</TableCell>
                    <TableCell>{user.last_name}</TableCell>
                    <TableCell>{user.address}</TableCell>
                    <TableCell>{user.is_admin ? 'Oui' : 'Non'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {activeTab === 'packs' && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Montant minimum</TableHead>
                  <TableHead>Taux de rendement</TableHead>
                  <TableHead>Actif</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {packs?.map((pack) => (
                  <TableRow key={pack.id}>
                    <TableCell>{pack.name}</TableCell>
                    <TableCell>{pack.min_amount}€</TableCell>
                    <TableCell>{pack.return_rate}%</TableCell>
                    <TableCell>{pack.is_active ? 'Oui' : 'Non'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {activeTab === 'transactions' && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Pack</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Méthode</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions?.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      {new Date(transaction.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {transaction.profiles?.first_name} {transaction.profiles?.last_name}
                    </TableCell>
                    <TableCell>{transaction.investment_packs?.name}</TableCell>
                    <TableCell>{transaction.amount}€</TableCell>
                    <TableCell>{transaction.status}</TableCell>
                    <TableCell>{transaction.payment_method}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;