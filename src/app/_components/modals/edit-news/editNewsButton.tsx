"use client";

import { useState } from "react";
import EditNewsModal from "./editNewsModal";
import { useEditNews } from "./useEditNews";
import { RiEdit2Fill } from "react-icons/ri";
import type { News } from "@prisma/client";

interface EditNewsButtonProps {
  news: News;
}

export function EditNewsButton({ news }: EditNewsButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { editNews, isLoading } = useEditNews();

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="cursor-pointer rounded-lg bg-white/10 p-2 hover:bg-green-500/30"
      >
        <RiEdit2Fill size={18} />
      </button>

      <EditNewsModal
        news={news}
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
        onSubmit={(data) => {
          editNews(data);
          setIsOpen(false);
        }}
      />
    </>
  );
}
