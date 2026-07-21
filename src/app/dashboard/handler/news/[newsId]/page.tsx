"use client";

import { api } from "~/trpc/react";
import ChatBox from "~/app/_components/chatBox";
import { InviteSection } from "~/app/_components/modals/invite-user/inviteSection";
import { TiDocumentText } from "react-icons/ti";
import { use, useEffect, useState } from "react";
import { GenerateTagsButton } from "~/app/_components/ai/generateTags";
import { toast } from "sonner";
import { FaTrashAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";

//import { useSocket } from "~/app/_components/socketProvider";

const priorityClasses: Record<string, string> = {
  LOW: "bg-green-500 text-white",
  MEDIUM: "bg-yellow-500 text-black",
  URGENT: "bg-red-600 text-white",
};

export default function NewsPage({
  params,
}: {
  params: Promise<{ newsId: string }>;
}) {
  const { newsId } = use(params);
  const { data: news, isLoading } = api.news.getNewsById.useQuery({
    id: newsId,
  });

  const { data: me } = api.user.me.useQuery();
  const utils = api.useUtils();
  //const { socket } = useSocket();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<
    "NEWS" | "STORE_MANUAL" | "PRODUCT_INFORMATION" | "CAMPAIGN"
  >("NEWS");
  const [tags, setTags] = useState<string[]>([]);

  const [priority, setPriority] = useState<
    "LOW" | "MEDIUM" | "HIGH" | "URGENT"
  >("LOW");

  const [isPublished, setIsPublished] = useState(true);
  const router = useRouter();

  const updateNews = api.news.updateNews.useMutation({
    onSuccess: () => {
      utils.news.getNewsById.invalidate();
      utils.news.listNews.invalidate();

      toast.success("Nyheten har sparats!", {
        description: "Alla ändringar har sparats.",
      });
    },

    onError: () => {
      toast.error("Kunde inte spara nyheten.");
    },
  });

  const removeNews = api.news.archiveNews.useMutation({
    onSuccess: () => {
      utils.news.listNews.invalidate();
      router.push("/dashboard/handler/news");
    },
  });

  const handleArchiveNews = (id: string) => {
    removeNews.mutate({
      id,
      isPublished: false,
    });
  };

  useEffect(() => {
    if (!news) return;

    setTitle(news.title);
    setContent(news.content);
    setCategory(news.category);
    setPriority(news.priority);
    setIsPublished(news.isPublished);
    setTags(news.tags.map((tag) => tag.name));
  }, [news]);

  if (isLoading || !news) {
    return (
      <main className="flex min-h-screen items-center justify-center text-white/70">
        Laddar nyhet...
      </main>
    );
  }

  return (
    <main className="main-page-layout">
      <div className="container">
        <div className="flex items-center justify-between rounded-2xl bg-white/5 p-5 shadow-lg/15 backdrop-blur-lg">
          <div>
            <button
              onClick={() => history.back()}
              className="text-sm text-white/60 transition hover:text-white"
            >
              ← Tillbaka
            </button>

            <h1 className="mt-2 text-3xl font-bold">Redigera nyhet</h1>

            <p className="text-white/60">
              Ändra innehåll, taggar och inställningar.
            </p>
          </div>
          <button
            onClick={() => handleArchiveNews(news.id)}
            className="cursor-pointer rounded-lg bg-white/10 p-3 hover:bg-red-500/30"
          >
            <FaTrashAlt size={18} />
          </button>
        </div>
        <div className="rounded-2xl bg-white/5 p-6 shadow-lg/15 backdrop-blur-lg">
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-white/70">
                Titel
              </label>

              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 transition outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-white/70">
                  Kategori
                </label>

                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value as typeof category)
                  }
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3"
                >
                  <option value="NEWS">Nyhet</option>
                  <option value="CAMPAIGN">Kampanj</option>
                  <option value="STORE_MANUAL">Butikshandbok</option>
                  <option value="PRODUCT_INFORMATION">
                    Produktinformation
                  </option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white/70">
                  Prioritet
                </label>

                <select
                  value={priority}
                  onChange={(e) =>
                    setPriority(e.target.value as typeof priority)
                  }
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3"
                >
                  <option>LOW</option>
                  <option>MEDIUM</option>
                  <option>HIGH</option>
                  <option>URGENT</option>
                </select>
              </div>
            </div>
            <div className="flex w-100 flex-col gap-3">
              <label className="mb-2 block text-sm font-medium text-white/70">
                Taggar:
              </label>
              {tags.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-purple-500/20 px-3 py-1 text-sm text-purple-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : (
                <div>
                  <GenerateTagsButton
                    text={`${title} ${content}`}
                    onGenerated={setTags}
                  />
                </div>
              )}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-white/70">
                Innehåll
              </label>

              <textarea
                rows={18}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-3 transition outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex justify-end">
              <button
                className="rounded-xl bg-blue-600 px-5 py-2 font-semibold hover:bg-blue-500"
                onClick={() =>
                  updateNews.mutate({
                    id: news.id,
                    title,
                    content,
                    category,
                    priority,
                    isPublished,
                    tags,
                  })
                }
              >
                Spara
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
