"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { FaTrashAlt } from "react-icons/fa";
import { EditSection } from "../modals/edit-news/editSection";
import type { RouterOutputs } from "~/trpc/react";

type News = RouterOutputs["news"]["listNews"][number];

type NewsCardProps = News;

export default function NewsCard({ ...newsProps }: NewsCardProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const utils = api.useUtils();

  const updateNews = api.news.updateNews.useMutation({
    onSuccess: (updateNews) => {
      utils.news.listNews.setData({}, (oldData) => {
        if (!oldData) return [];
        return oldData.map((news) =>
          news.id === updateNews.id ? { ...news, ...updateNews } : news,
        );
      });
    },
  });

  const publishNews = api.news.publishNews.useMutation({
    onSuccess: (updateNews) => {
      utils.news.listNews.setData({}, (oldData) => {
        if (!oldData) return [];
        return oldData.map((news) =>
          news.id === updateNews.id ? { ...news, ...updateNews } : news,
        );
      });
    },
  });

  const handleUpdateNews = (id: string) => {
    updateNews.mutate({
      id,
    });
  };

  const handleArchiveNews = (id: string) => {
    publishNews.mutate({
      id,
      isPublished: false,
    });
  };

  const isExpanded = expandedId === newsProps.id;

  return (
    <div
      key={newsProps.id}
      className="cursor-pointer rounded-2xl bg-white/5 p-6 shadow-lg/15 transition hover:bg-white/10"
      onClick={() => setExpandedId(isExpanded ? null : newsProps.id)}
    >
      {/* Header */}
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-xl font-bold">{newsProps.title}</h3>
        <span className="rounded-full bg-blue-500/20 px-2 py-1 text-xs text-blue-300">
          {newsProps.category}
        </span>
      </div>

      <p className="mb-2 text-sm text-white/70">
        {newsProps.createdAt.toLocaleDateString()} · {newsProps.createdBy?.name}
      </p>

      <p className="line-clamp-3 text-white/80">{newsProps.content}</p>

      {/* Expanded panel */}
      {isExpanded && (
        <div
          className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-3 text-white/90"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex gap-2">
            {/* EDIT */}
            <EditSection id={newsProps.id} />

            {/* DELETE */}
            <button
              onClick={() => handleArchiveNews(newsProps.id)}
              className="cursor-pointer rounded-lg bg-white/10 p-2 hover:bg-red-500/30"
            >
              <FaTrashAlt size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
