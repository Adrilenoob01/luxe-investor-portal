import { Checkbox } from "@/components/ui/checkbox";
import { Profile } from "@/types/profile";

interface RecipientsSelectorProps {
  users?: Pick<Profile, 'email' | 'first_name' | 'last_name'>[];
  selectedUsers: string[];
  selectAll: boolean;
  onSelectAll: (checked: boolean) => void;
  onUserSelect: (email: string, checked: boolean) => void;
}

export const RecipientsSelector = ({
  users,
  selectedUsers,
  selectAll,
  onSelectAll,
  onUserSelect,
}: RecipientsSelectorProps) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">
        Destinataires
      </label>
      <div className="space-y-2 max-h-48 overflow-y-auto border rounded-md p-2">
        <div className="flex items-center space-x-2 p-2 hover:bg-gray-50">
          <Checkbox
            checked={selectAll}
            onCheckedChange={(checked) => onSelectAll(checked === true)}
            id="select-all"
          />
          <label htmlFor="select-all" className="text-sm font-medium">
            Sélectionner tous les utilisateurs
          </label>
        </div>
        <div className="border-t" />
        {users?.map((user) => (
          user.email && (
            <div key={user.email} className="flex items-center space-x-2 p-2 hover:bg-gray-50">
              <Checkbox
                checked={selectedUsers.includes(user.email)}
                onCheckedChange={(checked) => onUserSelect(user.email!, checked === true)}
                id={`user-${user.email}`}
              />
              <label htmlFor={`user-${user.email}`} className="text-sm">
                {user.first_name} {user.last_name} ({user.email})
              </label>
            </div>
          )
        ))}
      </div>
      <div className="mt-2 text-sm text-gray-500">
        {selectedUsers.length} destinataire(s) sélectionné(s)
      </div>
    </div>
  );
};