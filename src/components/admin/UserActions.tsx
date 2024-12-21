import { useState } from "react";
import { Profile, OrderProject } from "@/types/supabase";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { CreateTransactionDialog } from "./CreateTransactionDialog";

interface UserActionsProps {
  user: Profile;
  packs: OrderProject[];
  refetchUsers: () => void;
}

export const UserActions = ({ user, packs, refetchUsers }: UserActionsProps) => {
  const [editingUser, setEditingUser] = useState<Profile | null>(null);

  const handleUpdateUser = async () => {
    if (!editingUser) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: editingUser.first_name,
          last_name: editingUser.last_name,
          address: editingUser.address,
          available_balance: editingUser.available_balance,
          invested_amount: editingUser.invested_amount
        })
        .eq('id', editingUser.id);

      if (error) throw error;

      toast.success("Informations utilisateur mises à jour");
      setEditingUser(null);
      refetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error("Erreur lors de la mise à jour des informations");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      toast.success("Utilisateur supprimé avec succès");
      refetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error("Erreur lors de la suppression de l'utilisateur");
    }
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setEditingUser(user)}
          >
            Modifier
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier l'utilisateur</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="firstName">Prénom</Label>
              <Input
                id="firstName"
                value={editingUser?.first_name || ""}
                onChange={(e) => setEditingUser(prev => prev ? {...prev, first_name: e.target.value} : null)}
              />
            </div>
            <div>
              <Label htmlFor="lastName">Nom</Label>
              <Input
                id="lastName"
                value={editingUser?.last_name || ""}
                onChange={(e) => setEditingUser(prev => prev ? {...prev, last_name: e.target.value} : null)}
              />
            </div>
            <div>
              <Label htmlFor="address">Adresse</Label>
              <Input
                id="address"
                value={editingUser?.address || ""}
                onChange={(e) => setEditingUser(prev => prev ? {...prev, address: e.target.value} : null)}
              />
            </div>
            <div>
              <Label htmlFor="balance">Solde disponible</Label>
              <Input
                id="balance"
                type="number"
                value={editingUser?.available_balance || 0}
                onChange={(e) => setEditingUser(prev => prev ? {...prev, available_balance: parseFloat(e.target.value)} : null)}
              />
            </div>
            <div>
              <Label htmlFor="invested">Montant investi</Label>
              <Input
                id="invested"
                type="number"
                value={editingUser?.invested_amount || 0}
                onChange={(e) => setEditingUser(prev => prev ? {...prev, invested_amount: parseFloat(e.target.value)} : null)}
              />
            </div>
            <Button onClick={handleUpdateUser}>Mettre à jour</Button>
          </div>
        </DialogContent>
      </Dialog>

      <CreateTransactionDialog 
        user={user}
        packs={packs}
        onTransactionCreated={refetchUsers}
      />

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="sm">Supprimer</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Cela supprimera définitivement l'utilisateur et toutes ses données associées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleDeleteUser(user.id)}>
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};