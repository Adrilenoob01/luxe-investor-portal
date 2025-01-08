import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Header } from "@/components/Header";
import { Loader2 } from "lucide-react";
import { ProfileForm } from "@/components/ProfileForm";
import { Button } from "@/components/ui/button";
import { Investment, Profile, Withdrawal } from "@/types/supabase";
import { WithdrawalRequestDialog } from "@/components/dashboard/WithdrawalRequestDialog";
import { TransactionHistory } from "@/components/dashboard/TransactionHistory";
import { ActiveInvestments } from "@/components/dashboard/ActiveInvestments";
import { PortfolioStats } from "@/components/dashboard/PortfolioStats";
import { PortfolioChart } from "@/components/dashboard/PortfolioChart";
import { useState } from "react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [showProfileDialog, setShowProfileDialog] = useState(false);

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
      
      // Check if profile is incomplete
      if (!data.first_name || !data.last_name) {
        setShowProfileDialog(true);
      }
      
      return data as Profile;
    },
  });

  const { data: investments = [], isLoading: investmentsLoading } = useQuery<Investment[]>({
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
            category,
            min_amount
          )
        `)
        .eq("user_id", session.user.id);

      if (error) throw error;
      return data as Investment[];
    },
  });

  const { data: withdrawals = [], isLoading: withdrawalsLoading, refetch: refetchWithdrawals } = useQuery<Withdrawal[]>({
    queryKey: ["withdrawals"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("withdrawals")
        .select("*")
        .eq("user_id", session.user.id);

      if (error) throw error;
      return data as Withdrawal[];
    },
  });

  // Calculate portfolio metrics for the chart
  const totalInvested = investments.reduce((sum, inv) => sum + Number(inv.amount), 0) || 0;
  const estimatedReturns = investments.reduce((sum, inv) => {
    const returnRate = inv.order_projects?.return_rate || 0;
    return sum + (Number(inv.amount) * (returnRate / 100));
  }, 0) || 0;

  const portfolioData = [
    { month: "Jan", value: totalInvested },
    { month: "Feb", value: totalInvested * 1.02 },
    { month: "Mar", value: totalInvested * 1.04 },
    { month: "Apr", value: totalInvested * 1.06 },
    { month: "May", value: totalInvested * 1.08 },
    { month: "Jun", value: totalInvested * 1.10 },
  ];

  if (profileLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complétez votre profil</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-muted-foreground mb-4">
            Pour continuer, veuillez renseigner votre nom et prénom.
          </div>
          <ProfileForm onComplete={() => setShowProfileDialog(false)} />
        </DialogContent>
      </Dialog>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="flex gap-4">
            <WithdrawalRequestDialog
              availableBalance={profile?.available_balance || 0}
              onRequestSubmitted={refetchWithdrawals}
            />
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
        </div>
        
        <PortfolioStats 
          availableBalance={profile?.available_balance || 0}
          investedAmount={profile?.invested_amount || 0}
          estimatedReturns={estimatedReturns}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <PortfolioChart data={portfolioData} />
          <ActiveInvestments investments={investments} />
        </div>

        <TransactionHistory 
          investments={investments} 
          withdrawals={withdrawals} 
        />
      </main>
    </div>
  );
};

export default Dashboard;
