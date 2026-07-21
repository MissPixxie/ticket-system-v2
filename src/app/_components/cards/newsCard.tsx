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
    onSuccess: () => {
      utils.news.listNews.invalidate();
    },
  });

  const handleArchiveNews = (id: string) => {
    updateNews.mutate({
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
    </div>
  );
}
