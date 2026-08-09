"use client";

import { api } from "~/trpc/react";
import ChatBox from "~/app/_components/chatBox";
import { InviteSection } from "~/app/_components/modals/invite-user/inviteSection";
import { TiDocumentText } from "react-icons/ti";
import { use, useEffect, useState } from "react";
import { GenerateTagsButton } from "~/app/_components/ai/generateTags";
import { toast } from "sonner";
import { FaSearchPlus, FaTrash, FaTrashAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { CldImage } from "next-cloudinary";
import { ImagePreviewModal } from "~/app/_components/modals/imagePreviewModal";
import { UploadImageButton } from "~/app/_components/cloudinaryUpload/uploadImageButton";
import { EditImageButton } from "~/app/_components/cloudinaryUpload/feEdit";
import CustomSelect from "~/app/_components/customSelect";

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
  const [imagePublicId, setImagePublicId] = useState<string | null>(null);
  const [category, setCategory] = useState<
    "NEWS" | "STORE_MANUAL" | "PRODUCT_INFORMATION" | "CAMPAIGN"
  >("NEWS");
  const [tags, setTags] = useState<string[]>([]);

  const [priority, setPriority] = useState<
    "LOW" | "MEDIUM" | "HIGH" | "URGENT"
  >("LOW");
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
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
    setImagePublicId(news.imagePublicId);
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
                className="input w-full rounded-lg px-4 py-3"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-white/70">
                  Kategori
                </label>

                <CustomSelect
                  value={category}
                  onChange={(value) => setCategory(value as typeof category)}
                  options={[
                    { value: "NEWS", label: "Nyhet" },
                    { value: "CAMPAIGN", label: "Kampanj" },
                    { value: "STORE_MANUAL", label: "Butikshandbok" },
                    {
                      value: "PRODUCT_INFORMATION",
                      label: "Produktinformation",
                    },
                  ]}
                  size="md"
                  className="w-full"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white/70">
                  Prioritet
                </label>

                <CustomSelect
                  value={priority}
                  onChange={(value) => setPriority(value as typeof priority)}
                  options={[
                    { value: "LOW", label: "LOW" },
                    { value: "MEDIUM", label: "MEDIUM" },
                    { value: "HIGH", label: "HIGH" },
                    { value: "URGENT", label: "URGENT" },
                  ]}
                  size="md"
                  className="w-full"
                />
              </div>
            </div>
            <div className="flex justify-between">
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
              <div className="flex w-full justify-end">
                <div className="mr-15 flex flex-col">
                  <h2 className="mb-4 text-lg font-semibold">Bilaga</h2>

                  {!news.imagePublicId ? (
                    <div className="w-100">
                      <UploadImageButton
                        onUpload={(publicId) => {
                          updateNews.mutate({
                            id: news.id,
                            imagePublicId: publicId,
                          });
                        }}
                      />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div
                        className="group relative overflow-hidden rounded-2xl"
                        onClick={() => setIsPreviewOpen(true)}
                      >
                        <CldImage
                          src={news.imagePublicId}
                          width={300}
                          height={100}
                          alt="Förhandsvisning"
                          className="w-full object-cover transition duration-300 group-hover:scale-105"
                        />
                        <div className="absolute top-3 right-3 z-20 flex gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                          <EditImageButton
                            onUpload={(publicId) => {
                              updateNews.mutate({
                                id: news.id,
                                imagePublicId: publicId,
                              });
                            }}
                          />

                          <button
                            type="button"
                            className="rounded-full bg-black/50 p-2 text-white transition hover:bg-red-500"
                            onClick={(e) => {
                              e.stopPropagation();
                              updateNews.mutate({
                                id: news.id,
                                imagePublicId: null,
                              });
                            }}
                          >
                            <FaTrash size={16} />
                          </button>
                        </div>
                        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/40">
                          <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white opacity-0 backdrop-blur-sm transition duration-300 group-hover:opacity-100">
                            <FaSearchPlus size={22} />
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-white/70">
                Innehåll
              </label>

              <textarea
                rows={18}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="input w-full resize-none rounded-xl px-4 py-3"
              />
            </div>
            <div className="flex justify-end">
              <button
                className="submit-button"
                onClick={() =>
                  updateNews.mutate({
                    id: news.id,
                    title,
                    content,
                    category,
                    priority,
                    isPublished,
                    tags,
                    imagePublicId,
                  })
                }
              >
                Spara
              </button>
            </div>
          </div>
        </div>
      </div>
      {isPreviewOpen && (
        <ImagePreviewModal
          isOpen={isPreviewOpen}
          imagePublicId={news.imagePublicId!}
          onClose={() => setIsPreviewOpen(false)}
        />
      )}
    </main>
  );
}
