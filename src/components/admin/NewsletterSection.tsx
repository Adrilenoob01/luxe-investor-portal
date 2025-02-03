import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Trash, Plus, Check, X } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";

export const NewsletterSection = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Query to check if user is admin
  const { data: userProfile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["user-profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single();
      if (error) {
        console.error("Error fetching user profile:", error);
        throw error;
      }
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: articles, isLoading: isLoadingArticles } = useQuery({
    queryKey: ["admin-newsletter-articles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("newsletter_articles")
        .select("*")
        .order("published_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const handleCreate = async () => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour créer un article.",
        variant: "destructive",
      });
      return;
    }

    if (!userProfile?.is_admin) {
      toast({
        title: "Erreur",
        description: "Vous devez être administrateur pour créer un article.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.from("newsletter_articles").insert([
        {
          title,
          content,
          image_url: imageUrl,
          author_id: user.id,
        },
      ]);

      if (error) {
        console.error("Error creating article:", error);
        throw error;
      }

      toast({
        title: "Article créé avec succès",
        description: "L'article a été ajouté à la newsletter.",
      });

      setIsCreating(false);
      setTitle("");
      setContent("");
      setImageUrl("");
      queryClient.invalidateQueries({ queryKey: ["admin-newsletter-articles"] });
    } catch (error) {
      console.error("Detailed error:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de l'article.",
        variant: "destructive",
      });
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      const { error } = await supabase
        .from("newsletter_articles")
        .update({
          title,
          content,
          image_url: imageUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Article mis à jour",
        description: "Les modifications ont été enregistrées.",
      });

      setEditingId(null);
      setTitle("");
      setContent("");
      setImageUrl("");
      queryClient.invalidateQueries({ queryKey: ["admin-newsletter-articles"] });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour de l'article.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("newsletter_articles")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Article supprimé",
        description: "L'article a été supprimé avec succès.",
      });

      queryClient.invalidateQueries({ queryKey: ["admin-newsletter-articles"] });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression de l'article.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (article: any) => {
    setEditingId(article.id);
    setTitle(article.title);
    setContent(article.content);
    setImageUrl(article.image_url || "");
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("newsletter_articles")
        .update({
          is_published: !currentStatus,
          published_at: !currentStatus ? new Date().toISOString() : null,
        })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: !currentStatus ? "Article publié" : "Article dépublié",
        description: !currentStatus
          ? "L'article est maintenant visible sur le site."
          : "L'article n'est plus visible sur le site.",
      });

      queryClient.invalidateQueries({ queryKey: ["admin-newsletter-articles"] });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la modification du statut.",
        variant: "destructive",
      });
    }
  };

  if (isLoadingProfile || isLoadingArticles) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Articles de la newsletter</h2>
        {userProfile?.is_admin && (
          <Button 
            onClick={() => setIsCreating(true)} 
            disabled={isCreating}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Nouvel article
          </Button>
        )}
      </div>

      {(isCreating || editingId) && userProfile?.is_admin && (
        <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
          <Input
            placeholder="Titre de l'article"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            placeholder="Contenu de l'article"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[200px]"
          />
          <Input
            placeholder="URL de l'image (optionnel)"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          <div className="flex space-x-2">
            <Button
              onClick={() => {
                if (editingId) {
                  handleUpdate(editingId);
                } else {
                  handleCreate();
                }
              }}
            >
              {editingId ? "Mettre à jour" : "Créer"}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreating(false);
                setEditingId(null);
                setTitle("");
                setContent("");
                setImageUrl("");
              }}
            >
              Annuler
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {articles?.map((article) => (
          <div
            key={article.id}
            className="bg-white p-4 rounded-lg shadow flex justify-between items-start"
          >
            <div className="space-y-2 flex-1">
              <h3 className="font-semibold">{article.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">
                {article.content}
              </p>
              <div className="text-sm text-gray-500">
                {format(new Date(article.published_at || new Date()), "d MMMM yyyy", {
                  locale: fr,
                })}
              </div>
            </div>
            {userProfile?.is_admin && (
              <div className="flex space-x-2 ml-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleTogglePublish(article.id, article.is_published)}
                >
                  {article.is_published ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <X className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleEdit(article)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDelete(article.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
