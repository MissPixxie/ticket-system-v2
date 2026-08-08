"use client";

import { useState } from "react";
import InviteUserModal from "./inviteUserModal";
import { useInviteUser } from "./useInviteUser";
import { FaUserPlus } from "react-icons/fa6";

interface InviteSectionProps {
  ticketId: string;
  conversationId: string;
}

export function InviteSection({
  ticketId,
  conversationId,
}: InviteSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { inviteUser, isLoading } = useInviteUser(ticketId);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        disabled={isLoading}
        className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white/80 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10 hover:text-white active:scale-95"
      >
        <FaUserPlus size={18} />
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
