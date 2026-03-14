"use client";

import { useState } from "react";
import { useCreateUser } from "./useCreateUser";
import CreateUserModal from "./createUserModal";
import { FaUserPlus } from "react-icons/fa6";

const ROLE_MAP = {
  USER: "cmmqoth2d0006x0u9q91ogbrc",
  HANDLER: "cmmqoth270005x0u9ugh7zbj8",
} as const;

export function UserSection() {
  const [isOpen, setIsOpen] = useState(false);
  const { createUser, isLoading } = useCreateUser();

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex cursor-pointer flex-row items-center justify-center rounded-md bg-linear-to-r from-purple-700 to-indigo-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
      >
        <span>Ny användare</span>
        <FaUserPlus size={20} className="ml-2" />
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
            roleId: ROLE_MAP[data.role],
            departments: data.departments,
          });

          setIsOpen(false);
        }}
      />
    </>
  );
}
