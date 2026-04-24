"use client";

import type { Resource } from "@prisma/client";
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

export type Category = "DOCUMENTATION" | "TUTORIAL" | "INFORMATION" | "OTHER";

export interface EditResourceData {
  id: string;
  title?: string;
  description?: string;
  category?: Category;
  url?: string;
  isPublished?: boolean;
}

interface EditResourceModalProps {
  resource: Resource;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EditResourceData) => void;
}

const EditResourceModal: React.FC<EditResourceModalProps> = ({
  resource,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState(resource.title ?? "");
  const [description, setDescription] = useState(resource.description ?? "");
  const [category, setCategory] = useState<Category>(resource.category ?? "OTHER");
  const [url, setUrl] = useState(resource.url ?? "");
  const [isSelected, setIsSelected] = useState<null | number>(null);

  if (!isOpen) return null;

  const categorys = [
    {
      id: 1,
      value: "DOCUMENTATION",
      label: "DOCUMENTATION",
      icon: <MdCampaign size={24} />,
    },
    {
      id: 2,
      value: "TUTORIAL",
      label: "TUTORIAL",
      icon: <FaRegFileAlt size={22} />,
    },
    {
      id: 3,
      value: "INFORMATION",
      label: "INFORMATION",
      icon: <ImInfo size={22} />,
    },
    {
      id: 4,
      value: "OTHER",
      label: "OTHER",
      icon: <FaShopify size={22} />,
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ id: resource.id, title, description, category, url, isPublished: true });
    setTitle("");
    setDescription("");
    setCategory("OTHER");
    setUrl("");
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
          <label htmlFor="content">Beskriv Resursen</label>
          <textarea
            placeholder="Beskriv resursen"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="h-full min-h-44 rounded-lg border border-black/50 bg-white/10 p-7 px-4 py-2 text-gray-200/65 required:border-red-500 required:text-red-500"
          />
          <label htmlFor="url">URL</label>
          <input
            type="text"
            placeholder="URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="rounded-lg border border-black/50 bg-white/5 px-4 py-3 text-gray-200/65 required:border-red-500 required:text-red-500"
          />
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

export default EditResourceModal;
