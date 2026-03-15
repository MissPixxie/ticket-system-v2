"use client";

import { useState } from "react";
import { dummyNews, type DummyNews } from "~/app/_data/dummyNews";
import { RiEdit2Fill } from "react-icons/ri";
import { FaTrashAlt } from "react-icons/fa";

export default function NewsPage() {
  const [news, setNews] = useState<DummyNews[]>(dummyNews);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // create inputs
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<DummyNews["category"]>("Nyheter");
  const [content, setContent] = useState("");

  // edit inputs
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] =
    useState<DummyNews["category"]>("Nyheter");
  const [editContent, setEditContent] = useState("");

  // CREATE
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

  // EDIT
  const startEdit = (item: DummyNews) => {
    setEditingId(item.id);
    setEditTitle(item.title);
    setEditCategory(item.category);
    setEditContent(item.content);
  };

  const handleUpdateNews = () => {
    if (!editingId) return;

    setNews((prev) =>
      prev.map((n) =>
        n.id === editingId
          ? {
              ...n,
              title: editTitle,
              category: editCategory,
              content: editContent,
            }
          : n,
      ),
    );

    setEditingId(null);
  };

  // DELETE
  const handleDeleteNews = (id: string) => {
    setNews((prev) => prev.filter((n) => n.id !== id));
    if (expandedId === id) setExpandedId(null);
    if (editingId === id) setEditingId(null);
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

        {/* Nyhetskort */}
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {news.map((item) => {
            const isExpanded = expandedId === item.id;
            const isEditing = editingId === item.id;

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

                {/* Expanded panel */}
                {isExpanded && (
                  <div
                    className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-3 text-white/90"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {!isEditing && (
                      <div className="flex gap-2">
                        {/* EDIT */}
                        <button
                          onClick={() => startEdit(item)}
                          className="cursor-pointer rounded-lg bg-white/10 p-2 hover:bg-green-500/30"
                        >
                          <RiEdit2Fill size={18} />
                        </button>

                        {/* DELETE */}
                        <button
                          onClick={() => handleDeleteNews(item.id)}
                          className="cursor-pointer rounded-lg bg-white/10 p-2 hover:bg-red-500/30"
                        >
                          <FaTrashAlt size={18} />
                        </button>
                      </div>
                    )}

                    {isEditing && (
                      <div className="flex flex-col gap-3">
                        <input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="rounded-lg bg-white/10 px-3 py-1 outline-none"
                        />
                        <select
                          value={editCategory}
                          onChange={(e) =>
                            setEditCategory(
                              e.target.value as DummyNews["category"],
                            )
                          }
                          className="rounded-lg bg-white/10 px-3 py-1"
                        >
                          <option value="Nyheter" className="text-black">
                            Nyheter
                          </option>
                          <option value="Butiksmanual" className="text-black">
                            Butiksmanual
                          </option>
                          <option
                            value="Produktinformation"
                            className="text-black"
                          >
                            Produktinformation
                          </option>
                          <option value="Kampanjer" className="text-black">
                            Kampanjer
                          </option>
                        </select>
                        <textarea
                          rows={4}
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="rounded-lg bg-white/10 px-3 py-1"
                        />
                        <div className="flex gap-3">
                          <button
                            onClick={handleUpdateNews}
                            className="rounded-lg bg-green-600 px-4 py-1 text-sm hover:bg-green-500"
                          >
                            Spara
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="rounded-lg bg-gray-600 px-4 py-1 text-sm hover:bg-gray-500"
                          >
                            Avbryt
                          </button>
                          <button
                            onClick={() => handleDeleteNews(item.id)}
                            className="rounded-lg bg-red-600 px-4 py-1 text-sm hover:bg-red-500"
                          >
                            Radera
                          </button>
                        </div>
                      </div>
                    )}
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
