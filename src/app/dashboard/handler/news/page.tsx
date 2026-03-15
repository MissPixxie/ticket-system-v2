"use client";

import { useState } from "react";
import { dummyNews, type DummyNews } from "~/app/_data/dummyNews";

export default function NewsPage() {
  const [news, setNews] = useState<DummyNews[]>(dummyNews);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<DummyNews["category"]>("Nyheter");
  const [content, setContent] = useState("");

  const handleCreateNews = () => {
    if (!title || !content) return;

    const newItem: DummyNews = {
      id: `n${news.length + 1}`,
      title,
      category,
      content,
      createdAt: new Date(),
      author: { id: "handler1", name: "HK Support" },
    };

    setNews([newItem, ...news]);
    setTitle("");
    setCategory("Nyheter");
    setContent("");
  };

  return (
    <main className="min-h-screen px-6 py-12 text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <h1 className="text-3xl font-bold tracking-wide">
          Nyheter & Information
        </h1>

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

        {/* Nyhetskort */}
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {news.map((item) => {
            const isExpanded = expandedId === item.id;
            return (
              <div
                key={item.id}
                className="cursor-pointer rounded-2xl bg-white/5 p-6 shadow-lg/15 transition hover:bg-white/10"
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
              >
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <span className="rounded-full bg-blue-500/20 px-2 py-1 text-xs text-blue-300">
                    {item.category}
                  </span>
                </div>
                <p className="mb-2 text-sm text-white/70">
                  {item.createdAt.toLocaleDateString()} · {item.author.name}
                </p>
                <p className="line-clamp-3 text-white/80">{item.content}</p>
                {isExpanded && (
                  <div className="mt-4 border-t border-white/10 pt-3 text-white/90">
                    {item.content}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
