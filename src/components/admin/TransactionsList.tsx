import { Investment } from "@/types/supabase";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TransactionsListProps {
  transactions: Investment[] | null;
}

export const TransactionsList = ({ transactions }: TransactionsListProps) => {
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
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};