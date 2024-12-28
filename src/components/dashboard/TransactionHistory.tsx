import { Card } from "@/components/ui/card";
import { Investment, Withdrawal } from "@/types/supabase";

interface TransactionHistoryProps {
  investments: Investment[];
  withdrawals: Withdrawal[];
}

export const TransactionHistory = ({ investments, withdrawals }: TransactionHistoryProps) => {
  // Combine and sort transactions by date
  const transactions = [
    ...investments.map(inv => ({
      type: 'investment' as const,
      date: new Date(inv.created_at),
      amount: inv.amount,
      status: inv.status,
      details: inv.order_projects?.name || 'N/A'
    })),
    ...withdrawals.map(w => ({
      type: 'withdrawal' as const,
      date: new Date(w.created_at),
      amount: w.amount,
      status: w.status,
      details: w.withdrawal_method || 'N/A'
    }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'cancelled':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Historique des transactions</h3>
      <div className="space-y-4">
        {transactions.map((transaction, index) => (
          <div
            key={index}
            className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
          >
            <div>
              <p className="font-semibold">
                {transaction.type === 'investment' ? 'Investissement' : 'Retrait'}
              </p>
              <p className="text-sm text-gray-600">
                {transaction.date.toLocaleDateString()} - {transaction.details}
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold">
                {transaction.type === 'withdrawal' ? '-' : '+'}{transaction.amount}€
              </p>
              <p className={`text-sm ${getStatusColor(transaction.status)}`}>
                {transaction.status === 'completed' ? 'Terminé' :
                 transaction.status === 'pending' ? 'En attente' :
                 transaction.status === 'cancelled' ? 'Annulé' : transaction.status}
              </p>
            </div>
          </div>
        ))}
        {transactions.length === 0 && (
          <p className="text-center text-gray-500">Aucune transaction</p>
        )}
      </div>
    </Card>
  );
};