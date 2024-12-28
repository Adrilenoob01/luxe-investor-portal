import { Investment } from "@/types/supabase";
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
  transactions: Investment[] | null;
  refetchTransactions: () => void;
}

export const TransactionsList = ({ transactions, refetchTransactions }: TransactionsListProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Utilisateur</TableHead>
          <TableHead>Commande</TableHead>
          <TableHead>Montant</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Méthode</TableHead>
          <TableHead>Actions</TableHead>
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
            <TableCell>{transaction.order_projects?.name}</TableCell>
            <TableCell>{transaction.amount}€</TableCell>
            <TableCell>{transaction.status}</TableCell>
            <TableCell>{transaction.payment_method}</TableCell>
            <TableCell>
              <EditTransactionDialog 
                transaction={transaction}
                onTransactionUpdated={refetchTransactions}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};