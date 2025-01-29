import { Card } from "@/components/ui/card";
import { Investment } from "@/types/supabase";

interface ActiveInvestmentsProps {
  investments: Investment[];
}

export const ActiveInvestments = ({ investments }: ActiveInvestmentsProps) => {
  // Filter out investments where the associated project has status 'paid'
  const activeInvestments = investments.filter(
    (investment) => investment.order_projects?.status !== 'paid'
  );

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Investissements actifs</h3>
      <div className="space-y-4">
        {activeInvestments.map((investment) => (
          <div
            key={investment.id}
            className="flex justify-between items-start p-4 bg-gray-50 rounded-lg"
          >
            <div>
              <p className="font-semibold">{investment.order_projects?.name}</p>
              <p className="text-sm text-gray-600">
                Taux de rendement : {investment.order_projects?.return_rate}%
              </p>
              <p className="text-sm text-gray-600">
                Investissement minimum : {investment.order_projects?.min_amount}€
              </p>
            </div>
            <p className="font-semibold">{Number(investment.amount).toLocaleString()}€</p>
          </div>
        ))}
        {activeInvestments.length === 0 && (
          <p className="text-center text-gray-500">Aucun investissement actif</p>
        )}
      </div>
    </Card>
  );
};