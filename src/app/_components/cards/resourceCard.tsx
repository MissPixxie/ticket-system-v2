"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { FaTrashAlt } from "react-icons/fa";
import type { RouterOutputs } from "~/trpc/react";
import { EditResourceSection } from "../modals/edit-resource/editResourceSection";

type Resources = RouterOutputs["resource"]["listResources"][number];

interface ResourceCardProps {
  resourceItem: Resources;
}

export default function ResourcesCard({ resourceItem }: ResourceCardProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const utils = api.useUtils();

  const unPublishResource = api.resource.updateResource.useMutation({
    onSuccess: () => {
      utils.resource.listResources.invalidate();
    },
  });

  const handleArchiveNews = (id: string) => {
    unPublishResource.mutate({
      id,
      isPublished: false,
    });
  };

  const isExpanded = expandedId === resourceItem.id;

  return (
    <div
      key={resourceItem.id}
      className="cursor-pointer rounded-2xl bg-white/5 p-6 shadow-lg/15 transition hover:bg-white/10"
      onClick={() => setExpandedId(isExpanded ? null : resourceItem.id)}
    >
      {/* Header */}
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-xl font-bold">{resourceItem.title}</h3>
        <span className="rounded-full bg-blue-500/20 px-2 py-1 text-xs text-blue-300">
          {resourceItem.category}
        </span>
      </div>

      <p className="mb-2 text-sm text-white/70">
        {resourceItem.createdAt.toLocaleDateString()} ·{" "}
        {resourceItem.createdBy?.name}
      </p>

      <p className="line-clamp-3 text-white/80">{resourceItem.description}</p>

      {/* Expanded panel */}
      {isExpanded && (
        <div
          className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-3 text-white/90"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex gap-2">
            {/* EDIT */}
            <EditResourceSection resource={resourceItem} />

            {/* DELETE */}
            <button
              onClick={() => handleArchiveNews(resourceItem.id)}
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
