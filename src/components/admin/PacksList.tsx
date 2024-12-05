import { InvestmentPack } from "@/types/supabase";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PacksListProps {
  packs: InvestmentPack[] | null;
}

export const PacksList = ({ packs }: PacksListProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nom</TableHead>
          <TableHead>Montant minimum</TableHead>
          <TableHead>Taux de rendement</TableHead>
          <TableHead>Actif</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {packs?.map((pack) => (
          <TableRow key={pack.id}>
            <TableCell>{pack.name}</TableCell>
            <TableCell>{pack.min_amount}€</TableCell>
            <TableCell>{pack.return_rate}%</TableCell>
            <TableCell>{pack.is_active ? 'Oui' : 'Non'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};