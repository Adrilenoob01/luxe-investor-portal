import { Profile } from "@/types/supabase";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface UsersTableProps {
  users: Profile[];
  children: React.ReactNode;
}

export const UsersTable = ({ users, children }: UsersTableProps) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>E-mail</TableHead>
        <TableHead>Prénom</TableHead>
        <TableHead>Nom</TableHead>
        <TableHead>Adresse</TableHead>
        <TableHead>Solde disponible</TableHead>
        <TableHead>Montant investi</TableHead>
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {users.map((user) => (
        <TableRow key={user.id}>
          <TableCell>{user.email}</TableCell>
          <TableCell>{user.first_name}</TableCell>
          <TableCell>{user.last_name}</TableCell>
          <TableCell>{user.address}</TableCell>
          <TableCell>{user.available_balance}€</TableCell>
          <TableCell>{user.invested_amount}€</TableCell>
          <TableCell className="space-x-2">
            {children}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);