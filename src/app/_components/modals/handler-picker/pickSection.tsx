"use client";

import { useState } from "react";
import PickHandlerModal from "./pickHandlerModal";
import { usePickHandler } from "./usePickHandler";
import { FaUserPlus } from "react-icons/fa6";

interface PickSectionProps {
  ticketId: string;
}

export function PickSection({ ticketId }: PickSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { pickHandler, isLoading } = usePickHandler();

  return (
    <>
      <button
        className="flex cursor-pointer flex-row gap-2 rounded bg-gray-700 p-2 shadow-md/20 hover:bg-gray-600"
        onClick={() => setIsOpen(true)}
      >
        Välj handläggare
        <FaUserPlus className="self-center" size={22} />
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
