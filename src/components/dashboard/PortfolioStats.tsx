import { Card } from "@/components/ui/card";

interface PortfolioStatsProps {
  availableBalance: number;
  investedAmount: number;
  estimatedReturns: number;
}

export const PortfolioStats = ({ availableBalance, investedAmount, estimatedReturns }: PortfolioStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-2">Solde disponible</h3>
        <p className="text-2xl font-bold text-primary">
          {availableBalance.toLocaleString()}€
        </p>
      </Card>
      
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-2">Montant investi</h3>
        <p className="text-2xl font-bold text-success-DEFAULT">
          {investedAmount.toLocaleString()}€
        </p>
      </Card>
      
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-2">Rendements estimés</h3>
        <p className="text-2xl font-bold text-secondary">
          {estimatedReturns.toLocaleString()}€
        </p>
      </Card>
    </div>
  );
};