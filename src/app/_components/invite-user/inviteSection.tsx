"use client";

import { useState } from "react";
import InviteUserModal from "./inviteUserModal";
import { useInviteUser } from "./useInviteUser";
import { FaUserPlus } from "react-icons/fa6";

interface InviteSectionProps {
  ticketId: string;
}

export function InviteSection({ ticketId }: InviteSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { inviteUser, isLoading } = useInviteUser();

  return (
    <>
      <button
        className="flex cursor-pointer flex-row gap-2 rounded bg-gray-700 p-2 shadow-md/20 hover:bg-gray-600"
        onClick={() => setIsOpen(true)}
      >
        Bjud in användare
        <FaUserPlus className="self-center" size={22} />
      </button>

      <InviteUserModal
        ticketId={ticketId}
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
