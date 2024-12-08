import { Profile, InvestmentPack } from "@/types/supabase";
import { UserActions } from "./UserActions";
import { UsersTable } from "./UsersTable";

interface UsersListProps {
  users: Profile[] | null;
  packs: InvestmentPack[];
  refetchUsers: () => void;
}

export const UsersList = ({ users, packs, refetchUsers }: UsersListProps) => {
  if (!users) return null;

  return (
    <UsersTable users={users}>
      {users.map((user) => (
        <UserActions 
          key={user.id} 
          user={user} 
          packs={packs}
          refetchUsers={refetchUsers} 
        />
      ))}
    </UsersTable>
  );
};