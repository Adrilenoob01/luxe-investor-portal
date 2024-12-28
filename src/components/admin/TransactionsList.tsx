import { Investment, Withdrawal } from "@/types/supabase";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EditTransactionDialog } from "./EditTransactionDialog";

interface TransactionsListProps {
  investments: Investment[] | null;
  withdrawals: Withdrawal[] | null;
  refetchTransactions: () => void;
}

type CombinedTransaction = {
  id: string;
  type: 'investment' | 'withdrawal';
  date: Date;
  user: {
    first_name: string | null;
    last_name: string | null;
  };
  amount: number;
  status: string;
  details: string;
  originalData: Investment | Withdrawal;
};

export const TransactionsList = ({ investments, withdrawals, refetchTransactions }: TransactionsListProps) => {
  const combinedTransactions: CombinedTransaction[] = [
    ...(investments?.map(inv => ({
      id: inv.id,
      type: 'investment' as const,
      date: new Date(inv.created_at),
      user: {
        first_name: inv.profiles?.first_name ?? null,
        last_name: inv.profiles?.last_name ?? null,
      },
      amount: inv.amount,
      status: inv.status,
      details: `Investissement - ${inv.order_projects?.name || 'N/A'}`,
      originalData: inv,
    })) || []),
    ...(withdrawals?.map(w => ({
      id: w.id,
      type: 'withdrawal' as const,
      date: new Date(w.created_at),
      user: {
        first_name: w.profiles?.first_name ?? null,
        last_name: w.profiles?.last_name ?? null,
      },
      amount: w.amount,
      status: w.status,
      details: `Retrait - ${w.withdrawal_method || 'N/A'}`,
      originalData: w,
    })) || []),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Détails</TableHead>
          <TableHead>Montant</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {combinedTransactions.map((transaction) => (
          <TableRow key={`${transaction.type}-${transaction.id}`}>
            <TableCell>
              {transaction.date.toLocaleDateString()}
            </TableCell>
            <TableCell>
              {transaction.user.first_name} {transaction.user.last_name}
            </TableCell>
            <TableCell>
              {transaction.type === 'investment' ? 'Investissement' : 'Retrait'}
            </TableCell>
            <TableCell>{transaction.details}</TableCell>
            <TableCell>{transaction.amount}€</TableCell>
            <TableCell>{transaction.status}</TableCell>
            <TableCell>
              <EditTransactionDialog 
                transaction={transaction.originalData}
                type={transaction.type}
                onTransactionUpdated={refetchTransactions}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};