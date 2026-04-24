"use client";

import type { News } from "@prisma/client";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import {
  FaHandHoldingHeart,
  FaLaptop,
  FaRegFileAlt,
  FaShopify,
  FaShoppingCart,
  FaUsers,
} from "react-icons/fa";
import { ImInfo } from "react-icons/im";
import { MdCampaign } from "react-icons/md";

export type Category =
  | "NEWS"
  | "STORE_MANUAL"
  | "PRODUCT_INFORMATION"
  | "CAMPAIGN";
export type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface EditNewsData {
  id: string;
  title?: string;
  content?: string;
  category?: Category;
  priority?: Priority;
}

interface EditNewsModalProps {
  news: News;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EditNewsData) => void;
}

const EditNewsModal: React.FC<EditNewsModalProps> = ({
  news,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState(news.title ?? "");
  const [content, setContent] = useState(news.content);
  const [priority, setPriority] = useState<Priority>(news.priority ?? "LOW");
  const [category, setCategory] = useState<Category>(news.category ?? "NEWS");
  const [isSelected, setIsSelected] = useState<null | number>(null);

  if (!isOpen) return null;

  const categorys = [
    { id: 1, value: "NEWS", label: "NEWS", icon: <MdCampaign size={24} /> },
    {
      id: 2,
      value: "STORE_MANUAL",
      label: "MANUAL",
      icon: <FaRegFileAlt size={22} />,
    },
    {
      id: 3,
      value: "PRODUCT_INFORMATION",
      label: "INFORMATION",
      icon: <ImInfo size={22} />,
    },
    {
      id: 4,
      value: "CAMPAIGN",
      label: "CAMPAIGN",
      icon: <FaShopify size={22} />,
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ id: news.id, title, content, category, priority });
    setTitle("");
    setContent("");
    setCategory("NEWS");
    setIsSelected(null);
  };

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs dark:bg-black/60"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-lg bg-linear-to-b p-6 shadow-lg dark:from-[#3b0e7a]/70 dark:to-[#282a53]/70"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center md:gap-8">
          {categorys.map((cat) => (
            <div
              key={cat.id}
              className="flex flex-col items-center justify-center gap-2"
            >
              <button
                onClick={() => {
                  setCategory(cat.value as Category);
                  setIsSelected(cat.id);
                }}
                className={`flex max-w-xs cursor-pointer flex-col items-center gap-4 rounded-xl p-4 shadow-lg/40 transition-all duration-300 ${
                  isSelected === cat.id
                    ? "scale-110 bg-blue-500 text-white"
                    : isSelected !== null
                      ? "bg-white/5 text-white/40 hover:bg-white/10"
                      : "bg-white/10 hover:bg-white/20"
                }`}
              >
                {cat.icon}
              </button>
              <span className="text-xs font-bold">{cat.label}</span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-2">
          <label htmlFor="title">Titel</label>
          <input
            type="text"
            placeholder="Titel"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded-lg border border-black/50 bg-white/5 px-4 py-3 text-gray-200/65 required:border-red-500 required:text-red-500"
          />
          <label htmlFor="content">Beskriv nyheten</label>
          <textarea
            placeholder="Beskriv nyheten"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="h-full min-h-44 rounded-lg border border-black/50 bg-white/10 p-7 px-4 py-2 text-gray-200/65 required:border-red-500 required:text-red-500"
          />
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold">Prioritet</label>
            <select
              value={priority}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="cursor-pointer rounded bg-gray-700 px-3 py-2 text-white shadow-md/20"
            >
              <option value="LOW">Låg</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">Hög</option>
              <option value="URGENT">Mycket Hög</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded border px-4 py-2"
            >
              Avbryt
            </button>
            <button type="submit" className="submit-button">
              Skicka
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
};

export default EditNewsModal;
