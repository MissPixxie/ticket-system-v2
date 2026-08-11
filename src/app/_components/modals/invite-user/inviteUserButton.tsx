"use client";

import { useState } from "react";
import InviteUserModal from "./inviteUserModal";
import { useInviteUser } from "./useInviteUser";
import { FaUserPlus } from "react-icons/fa6";

interface InviteUserButtonProps {
  ticketId: string;
  conversationId: string;
}

export function InviteUserButton({
  ticketId,
  conversationId,
}: InviteUserButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { inviteUser, isLoading } = useInviteUser(ticketId);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        disabled={isLoading}
        className="flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/80 shadow-lg shadow-black/10 transition-all duration-200 hover:border-blue-400/40 hover:bg-blue-500/10 hover:text-blue-300 active:scale-[0.98]"
      >
        <FaUserPlus className="self-center text-blue-300" size={18} />
        <span>{isLoading ? "Skickar..." : "Bjud in användare"}</span>
      </button>

      <InviteUserModal
        conversationId={conversationId}
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
        onSubmit={(data) => {
          inviteUser(data);
          setIsOpen(false);
        }}
      />
    </>
  );
}
