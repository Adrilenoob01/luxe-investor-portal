import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

interface CreateOrderDialogProps {
  onOrderCreated: () => void;
}

export const CreateOrderDialog = ({ onOrderCreated }: CreateOrderDialogProps) => {
  const [newPack, setNewPack] = useState({ 
    name: '', 
    minAmount: 0, 
    returnRate: 0 
  });

  const handleCreatePack = async () => {
    try {
      const { error } = await supabase
        .from('order_projects')
        .insert({
          name: newPack.name,
          target_amount: newPack.minAmount,
          return_rate: newPack.returnRate,
        });

      if (error) throw error;

      toast.success("Pack d'investissement créé avec succès");
      setNewPack({ name: '', minAmount: 0, returnRate: 0 });
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
      <DialogContent>
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
            <Label htmlFor="minAmount">Montant minimum</Label>
            <Input
              id="minAmount"
              type="number"
              value={newPack.minAmount}
              onChange={(e) => setNewPack({ ...newPack, minAmount: parseFloat(e.target.value) })}
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
          <Button onClick={handleCreatePack}>Créer</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};