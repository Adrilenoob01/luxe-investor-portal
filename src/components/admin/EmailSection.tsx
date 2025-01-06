import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Profile } from "@/types/profile";
import { Checkbox } from "@/components/ui/checkbox";

export const EmailSection = () => {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const { toast } = useToast();

  const { data: users } = useQuery({
    queryKey: ['admin-users-email'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('email, first_name, last_name')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Pick<Profile, 'email' | 'first_name' | 'last_name'>[];
    }
  });

  const formatContentToHtml = (text: string) => {
    let html = text.replace(/\n/g, '<br>');
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    return html;
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked && users) {
      setSelectedUsers(users.map(user => user.email || '').filter(Boolean));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleUserSelect = (email: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers(prev => [...prev, email]);
    } else {
      setSelectedUsers(prev => prev.filter(e => e !== email));
    }
  };

  const handleSendEmail = async () => {
    if (selectedUsers.length === 0 || !subject || !content) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner au moins un destinataire et remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    try {
      const formattedContent = formatContentToHtml(content);
      
      // Envoyer l'email à chaque destinataire sélectionné
      await Promise.all(selectedUsers.map(async (to) => {
        const { error } = await supabase.functions.invoke('send-admin-email', {
          body: {
            to,
            subject,
            content: formattedContent,
          },
        });

        if (error) throw error;
      }));

      toast({
        title: "Succès",
        description: "Les emails ont été envoyés avec succès",
      });

      // Reset form
      setSelectedUsers([]);
      setSelectAll(false);
      setSubject("");
      setContent("");
    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi des emails",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Envoyer un email</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Destinataires
          </label>
          <div className="space-y-2 max-h-48 overflow-y-auto border rounded-md p-2">
            <div className="flex items-center space-x-2 p-2 hover:bg-gray-50">
              <Checkbox
                checked={selectAll}
                onCheckedChange={handleSelectAll}
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
                    onCheckedChange={(checked) => handleUserSelect(user.email!, checked)}
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
        <div>
          <label className="block text-sm font-medium mb-1">
            Sujet
          </label>
          <Input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Sujet de l'email"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Contenu
          </label>
          <div className="text-sm text-gray-500 mb-2">
            Pour mettre du texte en gras, entourez-le avec des doubles astérisques : **texte en gras**
          </div>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Contenu de l'email"
            className="min-h-[200px] font-mono whitespace-pre-wrap"
          />
        </div>
        <Button 
          onClick={handleSendEmail} 
          disabled={isSending}
        >
          {isSending ? "Envoi en cours..." : "Envoyer l'email"}
        </Button>
      </div>
    </div>
  );
};