import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { UsersList } from "@/components/admin/UsersList";
import { PacksList } from "@/components/admin/PacksList";
import { TransactionsList } from "@/components/admin/TransactionsList";
import { Profile, OrderProject, Investment } from "@/types/supabase";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'users' | 'packs' | 'transactions'>('users');
  const [newUser, setNewUser] = useState({ firstName: '', lastName: '', email: '', password: '', address: '' });
  const [newPack, setNewPack] = useState({ name: '', minAmount: 0, returnRate: 0 });

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAdminAuthenticated");
    if (!isAuthenticated) {
      navigate("/admin/login");
    }
  }, [navigate]);

  const { data: users, refetch: refetchUsers } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Profile[];
    }
  });

  const { data: packs, refetch: refetchPacks } = useQuery<OrderProject[]>({
    queryKey: ['admin-packs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('order_projects')
        .select('*');
      if (error) throw error;
      return data;
    },
  });

  const { data: transactions } = useQuery<Investment[]>({
    queryKey: ['admin-transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('investments')
        .select(`
          *,
          profiles (
            id,
            first_name,
            last_name,
            address,
            is_admin,
            available_balance,
            invested_amount,
            email,
            created_at,
            updated_at
          ),
          order_projects (
            id,
            name,
            target_amount,
            return_rate,
            is_active,
            created_at,
            updated_at,
            description,
            collected_amount,
            implementation_date,
            end_date,
            status,
            image_url,
            short_description,
            detailed_description,
            location,
            category
          )
        `);
      if (error) throw error;
      return data;
    },
  });

  const handleCreateUser = async () => {
    try {
      console.log('Creating user with data:', newUser);
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newUser.email,
        password: newUser.password,
        options: {
          data: {
            first_name: newUser.firstName,
            last_name: newUser.lastName,
          },
        },
      });

      if (authError) {
        console.error('Auth error:', authError);
        throw authError;
      }

      console.log('Auth data:', authData);

      if (authData.user) {
        // Attendre un peu pour laisser le trigger créer le profil
        await new Promise(resolve => setTimeout(resolve, 1000));

        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            first_name: newUser.firstName,
            last_name: newUser.lastName,
            address: newUser.address,
          })
          .eq('id', authData.user.id);

        if (profileError) {
          console.error('Profile error:', profileError);
          throw profileError;
        }

        console.log('Profile updated successfully');
        toast.success("Utilisateur créé avec succès");
        
        // Réinitialiser le formulaire
        setNewUser({ firstName: '', lastName: '', email: '', password: '', address: '' });
        
        // Rafraîchir la liste des utilisateurs
        await refetchUsers();
      }
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error("Erreur lors de la création de l'utilisateur");
    }
  };

  const handleCreatePack = async () => {
    try {
      const { error } = await supabase
        .from('order_projects')
        .insert({
          name: newPack.name,
          target_amount: newPack.minAmount,
          return_rate: newPack.returnRate,
        });

      if (error) throw error;

      toast.success("Pack d'investissement créé avec succès");
      refetchPacks();
      setNewPack({ name: '', minAmount: 0, returnRate: 0 });
    } catch (error) {
      console.error('Error creating pack:', error);
      toast.error("Erreur lors de la création du pack");
    }
  };

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
            Commandes
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
            <>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="mb-4">Créer un utilisateur</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Créer un nouvel utilisateur</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="firstName">Prénom</Label>
                      <Input
                        id="firstName"
                        value={newUser.firstName}
                        onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Nom</Label>
                      <Input
                        id="lastName"
                        value={newUser.lastName}
                        onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="password">Mot de passe</Label>
                      <Input
                        id="password"
                        type="password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="address">Adresse</Label>
                      <Input
                        id="address"
                        value={newUser.address}
                        onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
                      />
                    </div>
                    <Button onClick={handleCreateUser}>Créer</Button>
                  </div>
                </DialogContent>
              </Dialog>

              <UsersList 
                users={users} 
                packs={packs || []} 
                refetchUsers={refetchUsers} 
              />
            </>
          )}

          {activeTab === 'packs' && (
            <>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="mb-4">Créer une commande</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Créer une nouvelle commande</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="packName">Nom</Label>
                      <Input
                        id="packName"
                        value={newPack.name}
                        onChange={(e) => setNewPack({ ...newPack, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="minAmount">Montant minimum</Label>
                      <Input
                        id="minAmount"
                        type="number"
                        value={newPack.minAmount}
                        onChange={(e) => setNewPack({ ...newPack, minAmount: parseFloat(e.target.value) })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="returnRate">Taux de rendement (%)</Label>
                      <Input
                        id="returnRate"
                        type="number"
                        value={newPack.returnRate}
                        onChange={(e) => setNewPack({ ...newPack, returnRate: parseFloat(e.target.value) })}
                      />
                    </div>
                    <Button onClick={handleCreatePack}>Créer</Button>
                  </div>
                </DialogContent>
              </Dialog>

              <PacksList packs={packs} refetchPacks={refetchPacks} />
            </>
          )}

          {activeTab === 'transactions' && (
            <TransactionsList transactions={transactions} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;