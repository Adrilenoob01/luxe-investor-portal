import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

interface CreateOrderDialogProps {
  onOrderCreated: () => void;
}

export const CreateOrderDialog = ({ onOrderCreated }: CreateOrderDialogProps) => {
  const [newPack, setNewPack] = useState({ 
    name: '', 
    minAmount: 5,
    targetAmount: 0,
    returnRate: 0,
    implementationDate: '',
    endDate: '',
    description: ''
  });

  const handleCreatePack = async () => {
    try {
      const { error } = await supabase
        .from('order_projects')
        .insert({
          name: newPack.name,
          target_amount: newPack.targetAmount,
          return_rate: newPack.returnRate,
          description: newPack.description,
          implementation_date: newPack.implementationDate,
          end_date: newPack.endDate,
          min_amount: newPack.minAmount,
        });

      if (error) throw error;

      toast.success("Pack d'investissement créé avec succès");
      setNewPack({ 
        name: '', 
        minAmount: 5,
        targetAmount: 0,
        returnRate: 0,
        implementationDate: '',
        endDate: '',
        description: ''
      });
      onOrderCreated();
    } catch (error) {
      console.error('Error creating pack:', error);
      toast.error("Erreur lors de la création du pack");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mb-4">Créer une commande</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle commande</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="packName">Nom</Label>
            <Input
              id="packName"
              value={newPack.name}
              onChange={(e) => setNewPack({ ...newPack, name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="minAmount">Montant minimum d'investissement</Label>
            <Input
              id="minAmount"
              type="number"
              value={newPack.minAmount}
              onChange={(e) => setNewPack({ ...newPack, minAmount: parseFloat(e.target.value) })}
            />
          </div>
          <div>
            <Label htmlFor="targetAmount">Montant cible (objectif)</Label>
            <Input
              id="targetAmount"
              type="number"
              value={newPack.targetAmount}
              onChange={(e) => setNewPack({ ...newPack, targetAmount: parseFloat(e.target.value) })}
            />
          </div>
          <div>
            <Label htmlFor="returnRate">Taux de rendement (%)</Label>
            <Input
              id="returnRate"
              type="number"
              value={newPack.returnRate}
              onChange={(e) => setNewPack({ ...newPack, returnRate: parseFloat(e.target.value) })}
            />
          </div>
          <div>
            <Label htmlFor="implementationDate">Date de début</Label>
            <Input
              id="implementationDate"
              type="date"
              value={newPack.implementationDate}
              onChange={(e) => setNewPack({ ...newPack, implementationDate: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="endDate">Date de fin</Label>
            <Input
              id="endDate"
              type="date"
              value={newPack.endDate}
              onChange={(e) => setNewPack({ ...newPack, endDate: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={newPack.description}
              onChange={(e) => setNewPack({ ...newPack, description: e.target.value })}
            />
          </div>
          <Button onClick={handleCreatePack} className="w-full">Créer</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};