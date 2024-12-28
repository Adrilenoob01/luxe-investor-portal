import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Header } from "@/components/Header";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ProfileForm } from "@/components/ProfileForm";
import { Button } from "@/components/ui/button";
import { Investment, Profile, Withdrawal } from "@/types/supabase";
import { WithdrawalRequestDialog } from "@/components/dashboard/WithdrawalRequestDialog";
import { TransactionHistory } from "@/components/dashboard/TransactionHistory";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
      }
    };
    checkAuth();
  }, [navigate]);

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error) throw error;
      return data as Profile;
    },
  });

  const { data: investments, isLoading: investmentsLoading } = useQuery<Investment[]>({
    queryKey: ["investments"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("investments")
        .select(`
          *,
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
        `)
        .eq("user_id", session.user.id);

      if (error) throw error;
      return data;
    },
  });

  const { data: withdrawals, isLoading: withdrawalsLoading, refetch: refetchWithdrawals } = useQuery<Withdrawal[]>({
    queryKey: ["withdrawals"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("withdrawals")
        .select("*")
        .eq("user_id", session.user.id);

      if (error) throw error;
      return data;
    },
  });

  // Calculate portfolio metrics
  const totalInvested = investments?.reduce((sum, inv) => sum + Number(inv.amount), 0) || 0;
  const estimatedReturns = investments?.reduce((sum, inv) => {
    const returnRate = inv.order_projects?.return_rate || 0;
    return sum + (Number(inv.amount) * (returnRate / 100));
  }, 0) || 0;

  // Mock data for the portfolio evolution graph
  const portfolioData = [
    { month: "Jan", value: totalInvested },
    { month: "Feb", value: totalInvested * 1.02 },
    { month: "Mar", value: totalInvested * 1.04 },
    { month: "Apr", value: totalInvested * 1.06 },
    { month: "May", value: totalInvested * 1.08 },
    { month: "Jun", value: totalInvested * 1.10 },
  ];

  if (profileLoading || investmentsLoading || withdrawalsLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Modifier mes informations</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Mes informations personnelles</DialogTitle>
              </DialogHeader>
              <ProfileForm />
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">Solde disponible</h3>
            <p className="text-2xl font-bold text-primary">
              {profile?.available_balance?.toLocaleString()}€
            </p>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">Montant investi</h3>
            <p className="text-2xl font-bold text-success-DEFAULT">
              {profile?.invested_amount?.toLocaleString()}€
            </p>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">Rendements estimés</h3>
            <p className="text-2xl font-bold text-secondary">
              {estimatedReturns.toLocaleString()}€
            </p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Évolution du portefeuille</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={portfolioData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#0EA5E9"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Investissements actifs</h3>
            <div className="space-y-4">
              {investments?.map((investment) => (
                <div
                  key={investment.id}
                  className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-semibold">{investment.order_projects?.name}</p>
                    <p className="text-sm text-gray-600">
                      Taux de rendement : {investment.order_projects?.return_rate}%
                    </p>
                  </div>
                  <p className="font-semibold">{Number(investment.amount).toLocaleString()}€</p>
                </div>
              ))}
              {(!investments || investments.length === 0) && (
                <p className="text-center text-gray-500">Aucun investissement actif</p>
              )}
            </div>
          </Card>
        </div>

        <TransactionHistory 
          investments={investments || []} 
          withdrawals={withdrawals || []} 
        />

        <div className="mt-8 flex justify-end">
          <WithdrawalRequestDialog
            availableBalance={profile?.available_balance || 0}
            onRequestSubmitted={refetchWithdrawals}
          />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;