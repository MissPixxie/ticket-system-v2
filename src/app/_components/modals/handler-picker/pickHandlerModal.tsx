"use client";

import React, { useState } from "react";
import ReactDOM from "react-dom";
import { api } from "~/trpc/react";
import { UserTable } from "../../userTable";

export interface PickHandlerUserData {
  userId: string;
  ticketId: string;
}

interface PickHandlerModalProps {
  ticketId: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PickHandlerUserData) => void;
}

const PickHandlerModal: React.FC<PickHandlerModalProps> = ({
  ticketId,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<null | string>(null);
  const { data, isLoading } = api.user.listAll.useQuery({ limit: 20 });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      userId: selected!,
      ticketId,
    });
    setSearch("");
    setSelected(null);
  };

  const visibleUsers = data?.users.filter((user) => {
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
        className="w-full max-w-3xl rounded-lg bg-linear-to-b from-[#3b0e7a]/70 to-[#282a53]/70 p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <UserTable />
        <div className="flex justify-end space-x-2 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg hover:bg-white/20 border px-4 py-2"
          >
            Avbryt
          </button>
          <button
            type="submit"
            className="cursor-pointer rounded-lg bg-blue-500 hover:bg-blue-400/90 px-10 py-3 text-white"
          >
            Bjud in
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default PickHandlerModal;
