import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Profile } from "@/types/profile";
import { EmailTemplateSelector } from "./email/EmailTemplateSelector";
import { RecipientsSelector } from "./email/RecipientsSelector";
import { TEMPLATES } from "./email/EmailTemplates";

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

  const handleTemplateChange = (templateKey: string) => {
    const template = TEMPLATES[templateKey as keyof typeof TEMPLATES];
    setSubject(template.subject);
    setContent(template.content);
  };

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
      if (users && users.length === selectedUsers.length) {
        setSelectAll(false);
      }
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
        <EmailTemplateSelector onTemplateChange={handleTemplateChange} />

        <RecipientsSelector
          users={users}
          selectedUsers={selectedUsers}
          selectAll={selectAll}
          onSelectAll={handleSelectAll}
          onUserSelect={handleUserSelect}
        />

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