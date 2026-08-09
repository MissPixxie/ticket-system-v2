"use client";

import { useState } from "react";
import NewsCard from "~/app/_components/cards/newsCard";
import { api } from "~/trpc/react";
import { MdCampaign } from "react-icons/md";
import { GenerateTagsButton } from "~/app/_components/ai/generateTags";
import Link from "next/link";
import { ImagePreviewModal } from "~/app/_components/modals/imagePreviewModal";
import { FaSearchPlus, FaTrash } from "react-icons/fa";
import { EditImageButton } from "~/app/_components/cloudinaryUpload/feEdit";
import { CldImage } from "next-cloudinary";
import { UploadImageButton } from "~/app/_components/cloudinaryUpload/uploadImageButton";
import CustomSelect from "~/app/_components/customSelect";

const PAGE_SIZE = 5;

const priorities = [
  {
    value: "LOW",
    label: "Låg",
    active: "bg-green-500 border border-green-300 shadow-green-500/30",
  },
  {
    value: "MEDIUM",
    label: "Medel",
    active: "bg-yellow-500 border border-yellow-300 shadow-yellow-500/30",
  },
  {
    value: "HIGH",
    label: "Hög",
    active: "bg-orange-500 border border-orange-300 shadow-orange-500/30",
  },
  {
    value: "URGENT",
    label: "Brådskande",
    active: "bg-red-600 border border-red-400 shadow-red-500/40 animate-pulse",
  },
];

export default function NewsPage() {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const utils = api.useUtils();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<
    "NEWS" | "STORE_MANUAL" | "PRODUCT_INFORMATION" | "CAMPAIGN"
  >("NEWS");
  const [content, setContent] = useState("");
  const [priority, setPriority] = useState<
    "LOW" | "MEDIUM" | "HIGH" | "URGENT"
  >("MEDIUM");
  const [tags, setTags] = useState<string[]>([]);
  const [imagePublicId, setImagePublicId] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
  const { data: news = [] } = api.news.listNews.useQuery({
    limit: visibleCount,
  });

  const createNews = api.news.createNews.useMutation({
    onSuccess: async () => {
      await utils.news.listNews.invalidate();

      setTitle("");
      setCategory("NEWS");
      setContent("");
      setTags([]);
      setImagePublicId("");
    },
  });

  const handleCreateNews = () => {
    if (!title.trim() || !content.trim()) return;

    createNews.mutate({
      title,
      content,
      category,
      priority,
      tags,
      imagePublicId,
    });
  };

  return (
    <main className="main-page-layout">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <div className="header-container">
          <MdCampaign className="text-purple-400" size={36} />
          <h1 className="page-header">Nyheter & information</h1>
        </div>

        {/* Skapa nyhet */}
        <div className="rounded-2xl bg-white/5 p-6 shadow-lg/15 backdrop-blur-lg">
          <h2 className="mb-4 text-xl font-semibold">Skapa ny nyhet</h2>

          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Titel"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input rounded-lg px-4 py-2"
            />
            <CustomSelect
              value={category}
              onChange={(value) =>
                setCategory(
                  value as
                    | "NEWS"
                    | "STORE_MANUAL"
                    | "PRODUCT_INFORMATION"
                    | "CAMPAIGN",
                )
              }
              options={[
                {
                  value: "NEWS",
                  label: "Nyheter",
                },
                {
                  value: "STORE_MANUAL",
                  label: "Butiksmanual",
                },
                {
                  value: "PRODUCT_INFORMATION",
                  label: "Produktinformation",
                },
                {
                  value: "CAMPAIGN",
                  label: "Kampanjer",
                },
              ]}
              className="w-full"
            />
            <textarea
              placeholder="Innehåll"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="input resize-none rounded-lg px-4 py-2"
            />
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex flex-col gap-2">
                <span className="text-sm text-white/70">Prioritet</span>

                <div className="flex flex-wrap gap-3">
                  {priorities.map((p) => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => setPriority(p.value as typeof priority)}
                      className={`rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${
                        priority === p.value
                          ? `scale-105 text-white shadow-lg ${p.active}`
                          : "bg-white/10 text-white/70 hover:bg-white/20"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex w-100 flex-col items-end gap-3">
                <GenerateTagsButton
                  text={`${title} ${content}`}
                  onGenerated={setTags}
                />
                {tags.length > 0 && (
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
                )}
              </div>
            </div>
            {!imagePublicId ? (
              <UploadImageButton
                onUpload={(publicId) => {
                  setImagePublicId(publicId);
                }}
              />
            ) : (
              <div className="space-y-3">
                <div
                  className="group relative overflow-hidden rounded-2xl"
                  onClick={() => setIsPreviewOpen(true)}
                >
                  <CldImage
                    src={imagePublicId}
                    width={600}
                    height={400}
                    alt="Förhandsvisning"
                    className="w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-3 right-3 z-20 flex gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <EditImageButton
                      onUpload={(publicId) => setImagePublicId(publicId)}
                    />

                    <button
                      type="button"
                      className="rounded-full bg-black/50 p-2 text-white transition hover:bg-red-500"
                      onClick={(e) => {
                        e.stopPropagation();

                        setImagePublicId("");
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
            <button
              onClick={handleCreateNews}
              className="cursor-pointer self-start rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
            >
              Skapa nyhet
            </button>
          </div>
        </div>
        {/* Lista nyhetskort */}
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {news.map((item) => (
            <Link
              href={`/dashboard/handler/news/${item.id}`}
              className="contents"
            >
              <NewsCard key={item.id} {...item} />
            </Link>
          ))}
        </div>
      </div>
      {isPreviewOpen && (
        <ImagePreviewModal
          isOpen={isPreviewOpen}
          imagePublicId={imagePublicId}
          onClose={() => setIsPreviewOpen(false)}
        />
      )}
    </main>
  );
}
