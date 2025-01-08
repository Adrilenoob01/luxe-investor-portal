import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Profile } from "@/types/profile";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PASSWORD_RESET_TEMPLATE = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Changer de mot de passe</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 0; padding: 0; background-color: #f9f9f9;">
        <tr>
            <td align="center" style="padding: 20px;">
                <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <tr>
                        <td style="padding: 20px; text-align: center;">
                            <h1 style="color: #333; font-size: 24px; margin: 0;">Changer votre mot de passe</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 20px; font-size: 16px; color: #555;">
                            <p>Bonjour,</p>
                            <p>Nous avons reçu une demande pour changer le mot de passe associé à votre compte WearShop. Si vous êtes à l'origine de cette demande, veuillez cliquer sur le bouton ci-dessous pour définir un nouveau mot de passe :</p>
                            <p>Merci de nous faire confiance,</p>
                            <p>L'équipe WearShop</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 20px;">
                            <table cellpadding="0" cellspacing="0" border="0" class="table__StyledTable-sc-1avdl6r-0 bztkJx" style="vertical-align: -webkit-baseline-middle; font-size: medium; font-family: Arial;">
                                <tbody>
                                    <tr>
                                        <td>
                                            <table cellpadding="0" cellspacing="0" border="0" class="table__StyledTable-sc-1avdl6r-0 bztkJx" style="vertical-align: -webkit-baseline-middle; font-size: medium; font-family: Arial;">
                                                <tbody>
                                                    <tr>
                                                        <td width="150" style="vertical-align: middle;">
                                                            <span class="template3__ImageContainer-sc-vj949k-0 gQAWto" style="margin-right: 20px; display: block;">
                                                                <img src="https://www.hebergeur-image.com/upload/88.126.209.209-677ecb62b0743.png" role="presentation" width="130" class="image__StyledImage-sc-hupvqm-0 ctEjzA" style="max-width: 130px;">
                                                            </span>
                                                        </td>
                                                        <td style="vertical-align: middle;">
                                                            <h2 color="#000000" class="name__NameContainer-sc-1m457h3-0 iegFqm" style="margin: 0px; font-size: 18px; color: rgb(0, 0, 0); font-weight: 600;">
                                                                <span>WearShop </span><span>&nbsp;</span><span>Invest</span>
                                                            </h2>
                                                            <p color="#000000" font-size="medium" class="job-title__Container-sc-1hmtp73-0 kWbWJx" style="margin: 0px; color: rgb(0, 0, 0); font-size: 14px; line-height: 22px;">
                                                                <span>Support client</span>
                                                            </p>
                                                        </td>
                                                        <td width="30">
                                                            <div style="width: 30px;"></div>
                                                        </td>
                                                        <td color="#63c2f7" direction="vertical" width="1" height="auto" class="color-divider__Divider-sc-1h38qjv-0 iqkkET" style="width: 1px; border-bottom: none; border-left: 1px solid rgb(99, 194, 247);"></td>
                                                        <td width="30">
                                                            <div style="width: 30px;"></div>
                                                        </td>
                                                        <td style="vertical-align: middle;">
                                                            <table cellpadding="0" cellspacing="0" border="0" class="table__StyledTable-sc-1avdl6r-0 bztkJx" style="vertical-align: -webkit-baseline-middle; font-size: medium; font-family: Arial;">
                                                                <tbody>
                                                                    <tr height="25" style="vertical-align: middle;">
                                                                        <td width="30" style="vertical-align: middle;">
                                                                            <table cellpadding="0" cellspacing="0" border="0" class="table__StyledTable-sc-1avdl6r-0 bztkJx" style="vertical-align: -webkit-baseline-middle; font-size: medium; font-family: Arial;">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td style="vertical-align: bottom;">
                                                                                            <span color="#63c2f7" width="11" class="contact-info__IconWrapper-sc-mmkjr6-1 dmdaIT" style="display: inline-block; background-color: rgb(99, 194, 247);">
                                                                                                <img src="https://cdn2.hubspot.net/hubfs/53/tools/email-signature-generator/icons/email-icon-2x.png" color="#63c2f7" alt="emailAddress" width="13" class="contact-info__ContactLabelIcon-sc-mmkjr6-0 cuMGNv" style="display: block; background-color: rgb(99, 194, 247);">
                                                                                            </span>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                        <td style="padding: 0px;">
                                                                            <a href="mailto:contact@wearshops.fr" color="#000000" font-size="medium" class="contact-info__ExternalLink-sc-mmkjr6-2 ixYHUl" style="text-decoration: none; color: rgb(0, 0, 0); font-size: 14px;">
                                                                                <span>contact@wearshops.fr</span>
                                                                            </a>
                                                                        </td>
                                                                    </tr>
                                                                    <tr height="25" style="vertical-align: middle;">
                                                                        <td width="30" style="vertical-align: middle;">
                                                                            <table cellpadding="0" cellspacing="0" border="0" class="table__StyledTable-sc-1avdl6r-0 bztkJx" style="vertical-align: -webkit-baseline-middle; font-size: medium; font-family: Arial;">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td style="vertical-align: bottom;">
                                                                                            <span color="#63c2f7" width="11" class="contact-info__IconWrapper-sc-mmkjr6-1 dmdaIT" style="display: inline-block; background-color: rgb(99, 194, 247);">
                                                                                                <img src="https://cdn2.hubspot.net/hubfs/53/tools/email-signature-generator/icons/link-icon-2x.png" color="#63c2f7" alt="website" width="13" class="contact-info__ContactLabelIcon-sc-mmkjr6-0 cuMGNv" style="display: block; background-color: rgb(99, 194, 247);">
                                                                                            </span>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                        <td style="padding: 0px;">
                                                                            <a href="//www.wearshops.fr" color="#000000" font-size="medium" class="contact-info__ExternalLink-sc-mmkjr6-2 ixYHUl" style="text-decoration: none; color: rgb(0, 0, 0); font-size: 14px;">
                                                                                <span>www.wearshops.fr</span>
                                                                            </a>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;

const TEMPLATES = {
  empty: { subject: "", content: "" },
  passwordReset: {
    subject: "Changement de mot de passe - WearShop Invest",
    content: PASSWORD_RESET_TEMPLATE,
  },
};

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
        <div>
          <label className="block text-sm font-medium mb-1">
            Template d'email
          </label>
          <Select onValueChange={handleTemplateChange} defaultValue="empty">
            <SelectTrigger>
              <SelectValue placeholder="Choisir un template" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="empty">Email vide</SelectItem>
              <SelectItem value="passwordReset">Changement de mot de passe</SelectItem>
            </SelectContent>
          </Select>
        </div>

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