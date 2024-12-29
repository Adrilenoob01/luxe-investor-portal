import { OrderProject } from "@/types/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

interface EditOrderDialogProps {
  pack: OrderProject;
  onUpdate: (updatedPack: OrderProject) => Promise<void>;
}

export const EditOrderDialog = ({ pack, onUpdate }: EditOrderDialogProps) => {
  const [editingPack, setEditingPack] = useState<OrderProject>(pack);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Modifier</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Modifier la commande</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[70vh] pr-4">
          <div className="space-y-4">
            <div>
              <Label>Nom</Label>
              <Input
                value={editingPack.name}
                onChange={(e) => setEditingPack({ ...editingPack, name: e.target.value })}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={editingPack.description}
                onChange={(e) => setEditingPack({ ...editingPack, description: e.target.value })}
              />
            </div>
            <div>
              <Label>Montant cible</Label>
              <Input
                type="number"
                value={editingPack.target_amount}
                onChange={(e) => setEditingPack({ ...editingPack, target_amount: parseFloat(e.target.value) })}
              />
            </div>
            <div>
              <Label>Montant collecté</Label>
              <Input
                type="number"
                value={editingPack.collected_amount}
                onChange={(e) => setEditingPack({ ...editingPack, collected_amount: parseFloat(e.target.value) })}
              />
            </div>
            <div>
              <Label>Taux de rendement (%)</Label>
              <Input
                type="number"
                value={editingPack.return_rate}
                onChange={(e) => setEditingPack({ ...editingPack, return_rate: parseFloat(e.target.value) })}
              />
            </div>
            <div>
              <Label>Statut</Label>
              <Select
                value={editingPack.status}
                onValueChange={(value) => setEditingPack({ ...editingPack, status: value })}
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
            <div>
              <Label>Date de début</Label>
              <Input
                type="date"
                value={editingPack.implementation_date?.split('T')[0] || ''}
                onChange={(e) => setEditingPack({ ...editingPack, implementation_date: e.target.value })}
              />
            </div>
            <div>
              <Label>Date de fin</Label>
              <Input
                type="date"
                value={editingPack.end_date?.split('T')[0] || ''}
                onChange={(e) => setEditingPack({ ...editingPack, end_date: e.target.value })}
              />
            </div>
            <Button onClick={() => onUpdate(editingPack)} className="w-full">Enregistrer</Button>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};