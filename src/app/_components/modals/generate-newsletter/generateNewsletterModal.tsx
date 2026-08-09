"use client";

import type { NewsCategory, Priority } from "@prisma/client";
import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { IoSparklesSharp } from "react-icons/io5";
import type { Prisma } from "@prisma/client";

const categories: NewsCategory[] = [
  "NEWS",
  "CAMPAIGN",
  "PRODUCT_INFORMATION",
  "STORE_MANUAL",
];

const priorities: Priority[] = ["LOW", "MEDIUM", "HIGH"];

type Newsletter = Pick<
  Prisma.NewsCreateInput,
  "title" | "content" | "category" | "priority"
>;

interface GenerateNewsletterModalProps {
  open: boolean;
  newsletter: Newsletter | null;
  onClose: () => void;
  onSend: (newsletter: Newsletter) => void;
}

export default function GenerateNewsletterModal({
  open,
  newsletter,
  onClose,
  onSend,
}: GenerateNewsletterModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<NewsCategory>("NEWS");
  const [priority, setPriority] = useState<Priority>("LOW");

  useEffect(() => {
    if (newsletter) {
      setTitle(newsletter.title);
      setContent(newsletter.content);
      setCategory(newsletter.category ?? "NEWS");
      setPriority(newsletter.priority ?? "LOW");
    }
  }, [newsletter]);

  if (!open || !newsletter) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl rounded-lg bg-linear-to-b from-[#3b0e7a]/70 to-[#282a53]/70 p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-5 flex items-center gap-2 text-xl font-semibold text-white">
          <IoSparklesSharp size={18} />
          AI-genererat nyhetsbrev
        </h2>

        <div className="flex flex-col gap-4">
          <div>
            <label className="mb-2 block text-sm text-white/60">Ämne</label>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full input rounded-xl px-4 py-300"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/60">
              Meddelande
            </label>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-purple-500"
            />
          </div>
        </div>
        <div>
          <div className="mt-4 flex flex-row gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-white/60">
                Kategori
              </label>
              <select
                value={newsletter.category}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => setCategory(e.target.value as NewsCategory)}
                className="cursor-pointer rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white backdrop-blur-sm transition-all outline-none hover:bg-white/10 focus:border-purple-500 focus:bg-white/10"
              >
                <option>OPEN</option>
                <option value="IN_PROGRESS">IN PROGRESS</option>
                <option>CLOSED</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-white/60">
                Prioritet
              </label>
              <select
                value={newsletter.priority}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="cursor-pointer rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white backdrop-blur-sm transition-all outline-none hover:bg-white/10 focus:border-purple-500 focus:bg-white/10"
              >
                <option>LOW</option>
                <option>MEDIUM</option>
                <option>HIGH</option>
                <option>URGENT</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white/80 hover:bg-white/10"
          >
            Stäng
          </button>

          <button
            onClick={() =>
              onSend({
                title,
                content,
                category,
                priority,
              })
            }
            className="submit-button"
          >
            Skicka nyhetsbrev
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
