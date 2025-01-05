import { Profile, OrderProject } from "@/types/supabase";
import { UserActions } from "./UserActions";
import { UsersTable } from "./UsersTable";

interface UsersListProps {
  users: Profile[] | null;
  packs: OrderProject[];
  refetchUsers: () => void;
}

export const UsersList = ({ users, packs, refetchUsers }: UsersListProps) => {
  if (!users) return null;

  const userActions = users.map((user) => (
    <UserActions 
      key={user.id} 
      user={user} 
      packs={packs}
      refetchUsers={refetchUsers} 
    />
  ));

  return (
    <UsersTable users={users}>
      {userActions}
    </UsersTable>
  );
};