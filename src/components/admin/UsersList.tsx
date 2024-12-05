import { useState } from "react";
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

interface UsersListProps {
  users: Profile[] | null;
  refetchUsers: () => void;
}

export const UsersList = ({ users, refetchUsers }: UsersListProps) => {
  const [newTransaction, setNewTransaction] = useState({ userId: '', amount: 0 });

  const handleAddFunds = async () => {
    try {
      const { error } = await supabase
        .from('investments')
        .insert({
          user_id: newTransaction.userId,
          amount: newTransaction.amount,
          status: 'completed',
          payment_method: 'admin',
        });

      if (error) throw error;

      toast.success("Fonds ajoutés avec succès");
      setNewTransaction({ userId: '', amount: 0 });
      refetchUsers();
    } catch (error) {
      console.error('Error adding funds:', error);
      toast.error("Erreur lors de l'ajout des fonds");
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Prénom</TableHead>
          <TableHead>Nom</TableHead>
          <TableHead>Adresse</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users?.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-mono">{user.id}</TableCell>
            <TableCell>{user.first_name}</TableCell>
            <TableCell>{user.last_name}</TableCell>
            <TableCell>{user.address}</TableCell>
            <TableCell>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">Ajouter des fonds</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Ajouter des fonds</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="amount">Montant</Label>
                      <Input
                        id="amount"
                        type="number"
                        value={newTransaction.amount}
                        onChange={(e) => setNewTransaction({
                          userId: user.id,
                          amount: parseFloat(e.target.value)
                        })}
                      />
                    </div>
                    <Button onClick={handleAddFunds}>Ajouter</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};