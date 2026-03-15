"use client";

import { useState } from "react";
import { dummyNews, type DummyNews } from "~/app/_data/dummyNews";
import { RiEdit2Fill } from "react-icons/ri";
import { FaTrashAlt } from "react-icons/fa";
import { EditSection } from "~/app/_components/edit-news/editSection";
import NewsCard from "~/app/_components/newsCard";
import { api } from "~/trpc/react";

export default function NewsPage() {
  const utils = api.useUtils();
  const [news, setNews] = useState<DummyNews[]>(dummyNews);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<
    "NEWS" | "STORE_MANUAL" | "PRODUCT_INFORMATION" | "CAMPAIGN"
  >("NEWS");
  const [content, setContent] = useState("");

  const createNews = api.news.createNews.useMutation({
    onSuccess: (newNews) => {
      utils.news.listNews.setData(undefined, (oldData) => {
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
    });
  };

  return (
    <main className="min-h-screen px-6 py-12 text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <h1 className="text-3xl font-bold tracking-wide">
          Nyheter & Information
        </h1>

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
                setCategory(e.target.value as DummyNews["category"])
              }
              className="rounded-lg bg-white/10 px-4 py-2 text-white outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Nyheter" className="text-black">
                Nyheter
              </option>
              <option value="Butiksmanual" className="text-black">
                Butiksmanual
              </option>
              <option value="Produktinformation" className="text-black">
                Produktinformation
              </option>
              <option value="Kampanjer" className="text-black">
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
            <NewsCard key={item.newsId} {...item} />
          ))}
        </div>
      </div>
    </main>
  );
}
