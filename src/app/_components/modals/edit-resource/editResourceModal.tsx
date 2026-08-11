"use client";

import React, { useState } from "react";
import ReactDOM from "react-dom";
import { FaRegFileAlt, FaShopify } from "react-icons/fa";
import { ImInfo } from "react-icons/im";
import { MdCampaign } from "react-icons/md";
import type { RouterOutputs } from "~/trpc/react";
import { GenerateTagsButton } from "../../ai/generateTags";
import { formatResourceCategory } from "~/app/utils/formatNotification";

type Resource = RouterOutputs["resource"]["listResources"][number];

export type Category = "DOCUMENTATION" | "TUTORIAL" | "INFORMATION" | "OTHER";

export interface EditResourceData {
  id: string;
  title?: string;
  description?: string;
  category?: Category;
  url?: string;
  isPublished?: boolean;
  tags?: string[];
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
  const [category, setCategory] = useState<Category>(
    resource.category ?? "OTHER",
  );
  const [url, setUrl] = useState(resource.url ?? "");
  const [tags, setTags] = useState<string[]>(
    resource.tags.map((tag) => tag.name),
  );

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
    onSubmit({
      id: resource.id,
      title,
      description,
      category,
      url,
      isPublished: true,
      tags,
    });
    setTitle("");
    setDescription("");
    setCategory("OTHER");
    setUrl("");
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
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {categorys.map((cat) => {
            const selected = category === cat.value;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.value as Category)}
                className={`flex h-24 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border shadow-lg/40 transition-all duration-300 ${
                  selected
                    ? "border-blue-500 bg-blue-500/20 text-blue-300"
                    : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10"
                }`}
              >
                <div
                  className={`transition-transform duration-200 ${
                    selected ? "scale-110" : ""
                  }`}
                >
                  {cat.icon}
                </div>

                <span className="text-sm font-medium">
                  {formatResourceCategory(cat.label)}
                </span>
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-2">
          <label htmlFor="title">Titel</label>
          <input
            type="text"
            placeholder="Titel"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input rounded-lg px-4 py-3 required:border-red-500 required:text-red-500"
          />
          <label htmlFor="content">Beskriv Resursen</label>
          <textarea
            placeholder="Beskriv resursen"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input h-full min-h-44 rounded-lg p-7 px-4 py-2 required:border-red-500 required:text-red-500"
          />
          <label htmlFor="url">URL</label>
          <input
            type="text"
            placeholder="URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="input rounded-lg px-4 py-3 required:border-red-500 required:text-red-500"
          />
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
                  text={`${title} ${description}`}
                  onGenerated={setTags}
                />
              </div>
            )}
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <button type="button" onClick={onClose} className="abort-button">
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
