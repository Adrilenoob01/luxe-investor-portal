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
import { EditOrderDialog } from "./EditOrderDialog";

interface PacksListProps {
  packs: OrderProject[] | null;
  refetchPacks: () => void;
}

export const PacksList = ({ packs, refetchPacks }: PacksListProps) => {
  const handleDeletePack = async (packId: string) => {
    try {
      // D'abord, supprimer tous les investissements associés
      const { error: investmentsError } = await supabase
        .from('investments')
        .delete()
        .eq('project_id', packId);

      if (investmentsError) {
        console.error('Error deleting investments:', investmentsError);
        throw investmentsError;
      }

      // Ensuite, supprimer le projet
      const { error: packError } = await supabase
        .from('order_projects')
        .delete()
        .eq('id', packId);

      if (packError) throw packError;

      toast.success("Commande supprimée avec succès");
      refetchPacks();
    } catch (error) {
      console.error('Error deleting pack:', error);
      toast.error("Erreur lors de la suppression de la commande");
    }
  };

  const handleUpdatePack = async (updatedPack: OrderProject) => {
    try {
      const { error } = await supabase
        .from('order_projects')
        .update({
          name: updatedPack.name,
          description: updatedPack.description,
          status: updatedPack.status,
          implementation_date: updatedPack.implementation_date,
          end_date: updatedPack.end_date,
          collected_amount: updatedPack.collected_amount,
          target_amount: updatedPack.target_amount,
          return_rate: updatedPack.return_rate,
        })
        .eq('id', updatedPack.id);

      if (error) throw error;

      toast.success("Commande mise à jour avec succès");
      refetchPacks();
    } catch (error) {
      console.error('Error updating pack:', error);
      toast.error("Erreur lors de la mise à jour de la commande");
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'collecting':
        return 'En cours';
      case 'completed':
        return 'Terminée';
      case 'upcoming':
        return 'Prochainement';
      case 'paid':
        return 'Intérêts payés';
      default:
        return status;
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nom</TableHead>
          <TableHead>Montant cible</TableHead>
          <TableHead>Montant collecté</TableHead>
          <TableHead>Taux de rendement</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {packs?.map((pack) => (
          <TableRow key={pack.id}>
            <TableCell>{pack.name}</TableCell>
            <TableCell>{pack.target_amount}€</TableCell>
            <TableCell>{pack.collected_amount}€</TableCell>
            <TableCell>{pack.return_rate}%</TableCell>
            <TableCell>{getStatusLabel(pack.status)}</TableCell>
            <TableCell className="space-x-2">
              <EditOrderDialog pack={pack} onUpdate={handleUpdatePack} />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">Supprimer</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Cette action est irréversible. Cela supprimera définitivement la commande et tous les investissements associés.
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