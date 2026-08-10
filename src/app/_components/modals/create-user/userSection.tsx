"use client";

import { useState } from "react";
import { useCreateUser } from "./useCreateUser";
import CreateUserModal from "./createUserModal";
import { FaUserPlus } from "react-icons/fa6";

export function UserSection() {
  const [isOpen, setIsOpen] = useState(false);
  const { createUser, isLoading } = useCreateUser();

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/80 shadow-lg shadow-black/10 transition-all duration-200 hover:border-blue-400/40 hover:bg-blue-500/10 hover:text-blue-300 active:scale-[0.98]"
      >
        <span>Ny användare</span>
        <FaUserPlus className="self-center text-blue-300" size={22} />
      </button>

      <CreateUserModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        isLoading={isLoading}
        onSubmit={(data) => {
          createUser({
            name: data.name,
            email: data.email,
            password: data.password,
            role: data.role,
            departments: data.departments,
          });

          setIsOpen(false);
        }}
      />
    </>
  );
}
