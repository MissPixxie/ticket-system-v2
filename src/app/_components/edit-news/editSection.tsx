"use client";

import { useState } from "react";
import EditNewsModal from "./editNewsModal";
import { useEditNews } from "./useEditNews";
import { RiEdit2Fill } from "react-icons/ri";

interface EditSectionProps {
  newsId: string;
}

export function EditSection({ newsId }: EditSectionProps) {
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
        newsId={newsId}
        isOpen={isOpen}
        onClose={() => {
          console.log("Closing modal!");
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
