import { useState, useEffect } from "react";
import { Profile } from "@/types/supabase";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface UsersListProps {
  users: Profile[] | null;
  refetchUsers: () => void;
}

interface UserWithEmail extends Profile {
  email: string;
}

export const UsersList = ({ users, refetchUsers }: UsersListProps) => {
  const [editingUser, setEditingUser] = useState<Profile | null>(null);
  const [usersWithEmail, setUsersWithEmail] = useState<UserWithEmail[]>([]);

  useEffect(() => {
    const fetchEmails = async () => {
      if (!users) return;
      
      const usersData = await Promise.all(
        users.map(async (user) => {
          const email = await getUserEmail(user.id);
          return { ...user, email };
        })
      );
      
      setUsersWithEmail(usersData);
    };

    fetchEmails();
  }, [users]);

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
      const { error } = await supabase.auth.admin.deleteUser(userId);

      if (error) throw error;

      toast.success("Utilisateur supprimé avec succès");
      refetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error("Erreur lors de la suppression de l'utilisateur");
    }
  };

  const getUserEmail = async (userId: string) => {
    try {
      const { data: { user }, error } = await supabase.auth.admin.getUserById(userId);
      if (error) throw error;
      return user?.email || "Email non disponible";
    } catch (error) {
      console.error('Error fetching user email:', error);
      return "Email non disponible";
    }
  };

  return (
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
        {usersWithEmail.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.first_name}</TableCell>
            <TableCell>{user.last_name}</TableCell>
            <TableCell>{user.address}</TableCell>
            <TableCell>{user.available_balance}€</TableCell>
            <TableCell>{user.invested_amount}€</TableCell>
            <TableCell className="space-x-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">Modifier</Button>
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
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};