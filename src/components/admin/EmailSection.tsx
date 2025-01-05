import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Profile } from "@/types/profile";

export const EmailSection = () => {
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);
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

  const handleSendEmail = async () => {
    if (!recipient || !subject || !content) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-admin-email', {
        body: {
          to: recipient,
          subject,
          content,
        },
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Succès",
        description: "L'email a été envoyé avec succès",
      });

      // Reset form
      setRecipient("");
      setSubject("");
      setContent("");
    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi de l'email",
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
            Destinataire
          </label>
          <select
            className="w-full rounded-md border border-input bg-background px-3 py-2"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          >
            <option value="">Sélectionner un destinataire</option>
            {users?.map((user) => (
              <option key={user.email} value={user.email}>
                {user.first_name} {user.last_name} ({user.email})
              </option>
            ))}
          </select>
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
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Contenu de l'email"
            className="min-h-[200px]"
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