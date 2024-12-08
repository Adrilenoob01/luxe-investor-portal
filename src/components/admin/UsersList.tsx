import { Profile } from "@/types/supabase";
import { UserActions } from "./UserActions";
import { UsersTable } from "./UsersTable";

interface UsersListProps {
  users: Profile[] | null;
  refetchUsers: () => void;
}

export const UsersList = ({ users, refetchUsers }: UsersListProps) => {
  if (!users) return null;

  return (
    <UsersTable users={users}>
      {users.map((user) => (
        <UserActions 
          key={user.id} 
          user={user} 
          refetchUsers={refetchUsers} 
        />
      ))}
    </UsersTable>
  );
};