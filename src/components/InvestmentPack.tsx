import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

interface InvestmentPackProps {
  title: string;
  minAmount: number;
  returnRate: number;
  description: string;
}

export const InvestmentPack = ({ title, minAmount, returnRate, description }: InvestmentPackProps) => {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
  }, []);

  const handleInvest = () => {
    if (!session) {
      navigate("/login");
    } else {
      navigate("/payment", { 
        state: { 
          packTitle: title,
          minAmount,
          returnRate
        } 
      });
    }
  };

  return (
    <Card className="card-hover shadow-card">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-3xl font-bold text-primary">
            {minAmount.toLocaleString()}€
            <span className="text-base font-normal text-gray-500"> minimum</span>
          </p>
          <p className="text-2xl font-semibold text-success-dark">
            +{returnRate}%
            <span className="text-base font-normal text-gray-500"> de rendement</span>
          </p>
        </div>
        <p className="text-gray-600">{description}</p>
      </CardContent>
      <CardFooter>
        <Button onClick={handleInvest} className="w-full">Investir maintenant</Button>
      </CardFooter>
    </Card>
  );
};