"use client";

import React, { useState } from "react";
import {
  FaHandHoldingHeart,
  FaLaptop,
  FaShopify,
  FaShoppingCart,
  FaUsers,
} from "react-icons/fa";

export type Category =
  | "NEWS"
  | "STORE_MANUAL"
  | "PRODUCT_INFORMATION"
  | "CAMPAIGN";
export type Priority = "LOW" | "MEDIUM" | "URGENT";

export interface EditNewsData {
  newsId: string;
  title: string;
  content: string;
  category: Category;
  priority?: Priority;
}

interface EditNewsModalProps {
  newsId: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EditNewsData) => void;
}

const EditNewsModal: React.FC<EditNewsModalProps> = ({
  newsId,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [priority, setPriority] = useState<Priority>("LOW");
  const [category, setCategory] = useState<Category>("NEWS");
  const [isSelected, setIsSelected] = useState<null | number>(null);

  if (!isOpen) return null;

  const categorys = [
    { id: 1, value: "NEWS", label: "NEWS", icon: <FaLaptop size={22} /> },
    {
      id: 2,
      value: "STORE_MANUAL",
      label: "STORE_MANUAL",
      icon: <FaUsers size={22} />,
    },
    {
      id: 3,
      value: "PRODUCT_INFORMATION",
      label: "PRODUCT_INFORMATION",
      icon: <FaShopify size={22} />,
    },
    {
      id: 4,
      value: "CAMPAIGN",
      label: "CAMPAIGN",
      icon: <FaShoppingCart size={22} />,
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ newsId, title, content, category, priority });
    setTitle("");
    setContent("");
    setCategory("NEWS");
    setIsSelected(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs dark:bg-black/60"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-lg bg-linear-to-b p-6 shadow-lg dark:from-[#3b0e7a]/70 dark:to-[#282a53]/70"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid grid-cols-5 gap-4 sm:grid-cols-5 md:gap-8">
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
                      ? "notSelected"
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
            className="rounded-lg border border-black/50 bg-white/10 p-7 px-4 py-2 text-black required:border-red-500 required:text-red-500"
          />
          <label htmlFor="content">Beskriv problemet</label>
          <textarea
            placeholder="Beskriv problemet"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="h-full min-h-44 rounded-lg border border-black/50 bg-white/10 p-7 px-4 py-2 text-black required:border-red-500 required:text-red-500"
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
              <option value="URGENT">Hög</option>
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
            <button
              type="submit"
              className="cursor-pointer rounded-full bg-blue-500 px-10 py-3 text-white"
            >
              Skicka
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditNewsModal;
