import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EmailTemplateSelectorProps {
  onTemplateChange: (templateKey: string) => void;
}

export const EmailTemplateSelector = ({ onTemplateChange }: EmailTemplateSelectorProps) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">
        Template d'email
      </label>
      <Select onValueChange={onTemplateChange} defaultValue="empty">
        <SelectTrigger>
          <SelectValue placeholder="Choisir un template" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="empty">Email vide</SelectItem>
          <SelectItem value="welcome">Bienvenue chez WearShop</SelectItem>
          <SelectItem value="investment_thank_you">Merci pour votre investissement</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};