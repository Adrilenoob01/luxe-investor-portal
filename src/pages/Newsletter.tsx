import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const Newsletter = () => {
  const { data: articles, isLoading } = useQuery({
    queryKey: ["newsletter-articles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("newsletter_articles")
        .select(`
          *,
          profiles (
            first_name,
            last_name
          )
        `)
        .eq("is_published", true)
        .order("published_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Newsletter</h1>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {articles?.map((article) => (
          <article
            key={article.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            {article.image_url && (
              <img
                src={article.image_url}
                alt={article.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {article.title}
              </h2>
              <p className="text-gray-600 mb-4 line-clamp-3">{article.content}</p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>
                  Par{" "}
                  {article.profiles?.first_name && article.profiles?.last_name
                    ? `${article.profiles.first_name} ${article.profiles.last_name}`
                    : "Anonyme"}
                </span>
                <span>
                  {format(new Date(article.published_at), "d MMMM yyyy", {
                    locale: fr,
                  })}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Newsletter;