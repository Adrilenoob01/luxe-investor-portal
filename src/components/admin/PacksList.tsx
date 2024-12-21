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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";

interface PacksListProps {
  packs: OrderProject[] | null;
  refetchPacks: () => void;
}

export const PacksList = ({ packs, refetchPacks }: PacksListProps) => {
  const [editingPack, setEditingPack] = useState<OrderProject | null>(null);

  const handleDeletePack = async (packId: string) => {
    try {
      const { error } = await supabase
        .from('order_projects')
        .delete()
        .eq('id', packId);

      if (error) throw error;

      toast.success("Commande supprimée avec succès");
      refetchPacks();
    } catch (error) {
      console.error('Error deleting pack:', error);
      toast.error("Erreur lors de la suppression de la commande");
    }
  };

  const handleUpdatePack = async () => {
    if (!editingPack) return;

    try {
      const { error } = await supabase
        .from('order_projects')
        .update({
          name: editingPack.name,
          description: editingPack.description,
          status: editingPack.status,
          implementation_date: editingPack.implementation_date,
          end_date: editingPack.end_date,
          category: editingPack.category,
          collected_amount: editingPack.collected_amount,
        })
        .eq('id', editingPack.id);

      if (error) throw error;

      toast.success("Commande mise à jour avec succès");
      refetchPacks();
      setEditingPack(null);
    } catch (error) {
      console.error('Error updating pack:', error);
      toast.error("Erreur lors de la mise à jour de la commande");
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
          <TableHead>Catégorie</TableHead>
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
            <TableCell>{pack.status}</TableCell>
            <TableCell>{pack.category}</TableCell>
            <TableCell className="space-x-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">Modifier</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Modifier la commande</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Nom</Label>
                      <Input
                        value={editingPack?.name || pack.name}
                        onChange={(e) => setEditingPack({ ...pack, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={editingPack?.description || pack.description}
                        onChange={(e) => setEditingPack({ ...pack, description: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Montant collecté</Label>
                      <Input
                        type="number"
                        value={editingPack?.collected_amount || pack.collected_amount}
                        onChange={(e) => setEditingPack({ ...pack, collected_amount: parseFloat(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Statut</Label>
                      <Select
                        value={editingPack?.status || pack.status}
                        onValueChange={(value) => setEditingPack({ ...pack, status: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un statut" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="collecting">En cours</SelectItem>
                          <SelectItem value="completed">Terminée</SelectItem>
                          <SelectItem value="upcoming">Prochainement</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Catégorie</Label>
                      <Input
                        value={editingPack?.category || pack.category || ''}
                        onChange={(e) => setEditingPack({ ...pack, category: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Date de début</Label>
                      <Input
                        type="date"
                        value={editingPack?.implementation_date?.split('T')[0] || pack.implementation_date?.split('T')[0] || ''}
                        onChange={(e) => setEditingPack({ ...pack, implementation_date: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Date de fin</Label>
                      <Input
                        type="date"
                        value={editingPack?.end_date?.split('T')[0] || pack.end_date?.split('T')[0] || ''}
                        onChange={(e) => setEditingPack({ ...pack, end_date: e.target.value })}
                      />
                    </div>
                    <Button onClick={handleUpdatePack}>Enregistrer</Button>
                  </div>
                </DialogContent>
              </Dialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">Supprimer</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Cette action est irréversible. Cela supprimera définitivement la commande.
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