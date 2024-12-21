import { OrderProject } from "@/types/supabase";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PacksListProps {
  packs: OrderProject[] | null;
  refetchPacks: () => void;
}

export const PacksList = ({ packs, refetchPacks }: PacksListProps) => {
  const handleDeletePack = async (packId: string) => {
    try {
      const { error } = await supabase
        .from('order_projects')
        .delete()
        .eq('id', packId);

      if (error) throw error;

      toast.success("Pack supprimé avec succès");
      refetchPacks();
    } catch (error) {
      console.error('Error deleting pack:', error);
      toast.error("Erreur lors de la suppression du pack");
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nom</TableHead>
          <TableHead>Montant cible</TableHead>
          <TableHead>Taux de rendement</TableHead>
          <TableHead>Actif</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {packs?.map((pack) => (
          <TableRow key={pack.id}>
            <TableCell>{pack.name}</TableCell>
            <TableCell>{pack.target_amount}€</TableCell>
            <TableCell>{pack.return_rate}%</TableCell>
            <TableCell>{pack.is_active ? 'Oui' : 'Non'}</TableCell>
            <TableCell>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">Supprimer</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Cette action est irréversible. Cela supprimera définitivement le projet d'investissement.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDeletePack(pack.id)}>
                      Supprimer
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};