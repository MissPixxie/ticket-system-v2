"use client";

import { useState } from "react";
import NewsCard from "~/app/_components/cards/newsCard";
import { api } from "~/trpc/react";
import { MdCampaign } from "react-icons/md";

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

  const { data: news = [] } = api.news.listNews.useQuery({
    limit: visibleCount,
  });

  const createNews = api.news.createNews.useMutation({
    onSuccess: (newNews) => {
      utils.news.listNews.setData({ limit: visibleCount }, (oldData) => {
        if (!oldData) return [newNews];
        return [newNews, ...oldData];
      });

      setTitle("");
      setCategory("NEWS");
      setContent("");
    },
  });

  const handleCreateNews = () => {
    if (!title.trim() || !content.trim()) return;

    createNews.mutate({
      title,
      content,
      category,
      priority,
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
              className="rounded-lg bg-white/10 px-4 py-2 text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={category}
              onChange={(e) =>
                setCategory(
                  e.target.value as
                    | "NEWS"
                    | "STORE_MANUAL"
                    | "PRODUCT_INFORMATION"
                    | "CAMPAIGN",
                )
              }
              className="rounded-lg bg-white/10 px-4 py-2 text-white outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="NEWS" className="text-black">
                Nyheter
              </option>
              <option value="STORE_MANUAL" className="text-black">
                Butiksmanual
              </option>
              <option value="PRODUCT_INFORMATION" className="text-black">
                Produktinformation
              </option>
              <option value="CAMPAIGN" className="text-black">
                Kampanjer
              </option>
            </select>
            <textarea
              placeholder="Innehåll"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="resize-none rounded-lg bg-white/10 px-4 py-2 text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
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
            <NewsCard key={item.id} {...item} />
          ))}
        </div>
      </div>
    </main>
  );
}
