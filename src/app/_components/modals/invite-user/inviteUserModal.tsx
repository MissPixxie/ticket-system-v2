"use client";

import React, { useState } from "react";
import { api } from "~/trpc/react";
import ReactDOM from "react-dom";
import FeedbackBubble from "../../feedbackBubble";

export interface InviteUserData {
  userId: string;
  conversationId: string;
}

interface InviteUserModalProps {
  conversationId: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: InviteUserData) => void;
}

const InviteUserModal: React.FC<InviteUserModalProps> = ({
  conversationId,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<null | string>(null);
  const [notify, setNotify] = useState(false);
  const { data: users, isLoading } = api.user.searchUser.useQuery(
    { query: search },
    {
      enabled: search.length >= 1,
    },
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      userId: selected!,
      conversationId,
    });
    setSearch("");
    setSelected(null);
    setNotify(true);
  };

  const visibleUsers = users?.filter((user) => {
    const searchLower = search.toLowerCase();
    return (
      user.name?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.role?.name.toLowerCase().includes(searchLower)
    );
  });

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-lg bg-linear-to-b from-[#3b0e7a]/80 to-[#282a53]/80 p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-2">
          <label htmlFor="title">Sök användare</label>
          <input
            type="text"
            placeholder="Sök användare..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input w-full rounded-xl py-3 pr-4 pl-4"
          />
          <div className="mt-3 flex flex-col gap-2">
            {visibleUsers?.map((user) => (
              <button
                key={user.id}
                type="button"
                onClick={() => setSelected(user.id)}
                className={`w-full rounded-xl border px-4 py-2 text-left transition-all ${
                  selected === user.id
                    ? "border-purple-500 bg-purple-500/20 text-white shadow-lg shadow-purple-500/20"
                    : "border-white/10 bg-white/5 text-white/80 hover:border-white/20 hover:bg-white/10 hover:text-white"
                }`}
              >
                <div className="font-medium">{user.name}</div>
                <div className="text-sm text-white/50">{user.email}</div>
              </button>
            ))}
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded border px-4 py-2"
            >
              Avbryt
            </button>
            <button type="submit" className="submit-button">
              Bjud in
            </button>
          </div>
        </form>
      </div>
      <FeedbackBubble
        open={notify}
        message="Användaren bjöds in!"
        onClose={() => setNotify(false)}
      />
    </div>,
    document.body,
  );
};

export default InviteUserModal;
