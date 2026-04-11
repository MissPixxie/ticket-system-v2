"use client";

import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Department } from "@prisma/client";
import { toast } from "sonner";
import {
  FaLaptop,
  FaUsers,
  FaShopify,
  FaShoppingCart,
  FaHandHoldingHeart,
} from "react-icons/fa";
import { ROLE_MAP } from "~/app/constants/roles";

type RoleKey = keyof typeof ROLE_MAP;

const departments = [
  { value: Department.IT, label: "IT", icon: <FaLaptop size={22} /> },
  { value: Department.HR, label: "HR", icon: <FaUsers size={22} /> },
  {
    value: Department.CAMPAIGN,
    label: "Kampanj",
    icon: <FaShopify size={22} />,
  },
  {
    value: Department.PRODUCT,
    label: "Produkt",
    icon: <FaShoppingCart size={22} />,
  },
  {
    value: Department.CUSTOMERCLUB,
    label: "Kundklubb",
    icon: <FaHandHoldingHeart size={22} />,
  },
];

export interface CreateUserInput {
  email: string;
  name: string;
  password: string;
  role: RoleKey;
  departments: Department[];
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateUserInput) => void;
  isLoading?: boolean;
}

export default function CreateUserModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: Props) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<RoleKey>("USER");
  const [selectedDepartments, setSelectedDepartments] = useState<Department[]>(
    [],
  );

  if (!isOpen) return null;

  const isDepartmentDisabled = role === "USER";

  function handleDepartmentChange(dep: Department) {
    if (isDepartmentDisabled) return;

    setSelectedDepartments((prev) =>
      prev.includes(dep) ? prev.filter((d) => d !== dep) : [...prev, dep],
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    onSubmit({
      email,
      name,
      password,
      role,
      departments: selectedDepartments,
    });

    setEmail("");
    setName("");
    setPassword("");
    setRole("USER");
    setSelectedDepartments([]);
    toast.success("Användare skapad!");
  }

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs dark:bg-black/60"
      onClick={onClose}
    >
      <div
        className="w-full max-w-5xl rounded-2xl bg-linear-to-b from-[#3b0e7a]/70 to-[#282a53]/70 p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-8 text-center text-3xl font-bold">Skapa Användare</h2>

        <form onSubmit={handleSubmit} className="grid gap-8 md:grid-cols-2">
          {/* VÄNSTER */}
          <div className="flex flex-col gap-4">
            <div>
              <label className="mb-1 block font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-gray-200/65 placeholder:text-white/40 focus:border-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="mb-1 block font-medium">Namn</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-gray-200/65 placeholder:text-white/40 focus:border-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="mb-1 block font-medium">Lösenord</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-gray-200/65 placeholder:text-white/40 focus:border-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="mb-1 block font-medium">Typ av användare</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as RoleKey)}
                className="w-full cursor-pointer rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="USER" className="cursor-pointer text-black">
                  Vanlig användare
                </option>
                <option value="HANDLER" className="cursor-pointer text-black">
                  Handläggare
                </option>
              </select>
            </div>
          </div>

          {/* HÖGER */}
          <div>
            <p className="mb-4 text-center text-lg">Avdelningar</p>

            <div className="grid grid-cols-2 gap-4">
              {departments.map((dep) => {
                const isSelected = selectedDepartments.includes(dep.value);

                return (
                  <button
                    key={dep.value}
                    type="button"
                    disabled={isDepartmentDisabled}
                    onClick={() => handleDepartmentChange(dep.value)}
                    className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-3 transition-all duration-200 ${
                      isDepartmentDisabled
                        ? "cursor-not-allowed border-white/5 bg-white/5 text-white/30"
                        : isSelected
                          ? "cursor-pointer border-blue-500 bg-blue-500/20 text-blue-300 shadow-md"
                          : "cursor-pointer border-white/10 bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    {dep.icon}
                    <span className="text-sm font-medium">{dep.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* KNAPP */}
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={isLoading}
              className="submit-button"
            >
              {isLoading ? "Skapar..." : "Skapa användare"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
