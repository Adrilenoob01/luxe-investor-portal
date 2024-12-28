import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { UsersList } from "@/components/admin/UsersList";
import { PacksList } from "@/components/admin/PacksList";
import { TransactionsList } from "@/components/admin/TransactionsList";
import { CreateUserDialog } from "@/components/admin/CreateUserDialog";
import { CreateOrderDialog } from "@/components/admin/CreateOrderDialog";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { TabNavigation } from "@/components/admin/TabNavigation";
import { Profile, OrderProject, Investment, Withdrawal } from "@/types/supabase";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'users' | 'packs' | 'transactions'>('users');

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

  const { data: investments, refetch: refetchInvestments } = useQuery<Investment[]>({
    queryKey: ['admin-investments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('investments')
        .select(`
          *,
          profiles (
            id,
            first_name,
            last_name
          ),
          order_projects (
            id,
            name
          )
        `);
      if (error) throw error;
      return data as Investment[];
    },
  });

  const { data: withdrawals, refetch: refetchWithdrawals } = useQuery<Withdrawal[]>({
    queryKey: ['admin-withdrawals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('withdrawals')
        .select(`
          *,
          profiles (
            id,
            first_name,
            last_name
          )
        `);
      if (error) throw error;
      return data as Withdrawal[];
    },
  });

  const refetchTransactions = () => {
    refetchInvestments();
    refetchWithdrawals();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader onLogout={() => {
        localStorage.removeItem("isAdminAuthenticated");
        navigate("/admin/login");
      }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="bg-white rounded-lg shadow p-6">
          {activeTab === 'users' && (
            <>
              <CreateUserDialog onUserCreated={refetchUsers} />
              <UsersList 
                users={users} 
                packs={packs || []} 
                refetchUsers={refetchUsers} 
              />
            </>
          )}

          {activeTab === 'packs' && (
            <>
              <CreateOrderDialog onOrderCreated={refetchPacks} />
              <PacksList packs={packs} refetchPacks={refetchPacks} />
            </>
          )}

          {activeTab === 'transactions' && (
            <TransactionsList 
              investments={investments}
              withdrawals={withdrawals}
              refetchTransactions={refetchTransactions}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;