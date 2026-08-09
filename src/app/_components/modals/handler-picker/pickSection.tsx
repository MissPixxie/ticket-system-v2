"use client";

import { useState } from "react";
import PickHandlerModal from "./pickHandlerModal";
import { usePickHandler } from "./usePickHandler";
import { FaUserPlus } from "react-icons/fa6";

interface PickSectionProps {
  ticketId: string;
  onClick?: (e: React.MouseEvent) => void;
}

export function PickSection({ ticketId, onClick }: PickSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { pickHandler, isLoading } = usePickHandler();

  return (
    <>
      <button
        className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/80 shadow-lg shadow-black/10 transition-all duration-200 hover:border-blue-400/40 hover:bg-blue-500/10 hover:text-blue-300 active:scale-[0.98]"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClick?.(e);
          setIsOpen(true);
        }}
      >
        Välj handläggare
        <FaUserPlus className="self-center text-blue-300" size={22} />
      </button>

      <PickHandlerModal
        ticketId={ticketId}
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
        onSubmit={(data) => {
          pickHandler(data);
          setIsOpen(false);
        }}
      />
    </>
  );
}
