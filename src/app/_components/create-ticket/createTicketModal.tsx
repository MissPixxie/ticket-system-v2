"use client";

import React, { useState } from "react";
import {
  FaHandHoldingHeart,
  FaLaptop,
  FaShopify,
  FaShoppingCart,
  FaUsers,
} from "react-icons/fa";

export type Department = "IT" | "HR" | "CAMPAIGN" | "PRODUCT" | "CUSTOMERCLUB";

export interface CreateTicketData {
  title: string;
  issue: string;
  department: Department;
  isAnonymous?: boolean;
}

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTicketData) => void;
}

const CreateTicketModal: React.FC<CreateTicketModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [title, setTitle] = useState("");
  const [issue, setIssue] = useState("");
  const [department, setDepartment] = useState<Department>("IT");
  const [isSelected, setIsSelected] = useState<null | number>(null);

  if (!isOpen) return null;

  const departments = [
    { id: 1, value: "IT", label: "IT", icon: <FaLaptop size={22} /> },
    { id: 2, value: "HR", label: "HR", icon: <FaUsers size={22} /> },
    {
      id: 3,
      value: "CAMPAIGN",
      label: "Kampanj",
      icon: <FaShopify size={22} />,
    },
    {
      id: 4,
      value: "PRODUCT",
      label: "Produkt",
      icon: <FaShoppingCart size={22} />,
    },
    {
      id: 5,
      value: "CUSTOMERCLUB",
      label: "Kundklubb",
      icon: <FaHandHoldingHeart size={22} />,
    },
  ];

  const orderedDepartments = [...departments];
  if (isSelected !== null) {
    const index = orderedDepartments.findIndex((dep) => dep.id === isSelected);
    if (index !== -1) {
      const [selected] = orderedDepartments.splice(index, 1);
      if (selected) {
        orderedDepartments.splice(2, 0, selected);
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, issue, department, isAnonymous });
    setTitle("");
    setIssue("");
    setDepartment("IT");
    setIsSelected(null);
    setIsAnonymous(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-lg bg-linear-to-b from-[#3b0e7a] to-[#282a53] p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid grid-cols-5 gap-4 sm:grid-cols-5 md:gap-8">
          {orderedDepartments.map((dep) => (
            <div
              key={dep.id}
              className="flex flex-col items-center justify-center gap-2"
            >
              <button
                onClick={() => {
                  setDepartment(dep.value as Department);
                  setIsSelected(dep.id);
                }}
                className={`flex max-w-xs flex-col items-center gap-4 rounded-xl p-4 shadow-lg/40 transition-all duration-300 ${
                  isSelected === dep.id
                    ? "scale-110 bg-blue-500 text-white"
                    : isSelected !== null
                      ? "notSelected"
                      : "bg-white/10 hover:bg-white/20"
                }`}
              >
                {dep.icon}
              </button>
              <span className="text-xs font-bold">{dep.label}</span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-2">
          <label htmlFor="title">Titel</label>
          <input
            type="text"
            placeholder="Titel"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded-lg border border-black/50 bg-white/10 p-7 px-4 py-2 text-black required:border-red-500 required:text-red-500"
          />
          <label htmlFor="issue">Beskriv problemet</label>
          <textarea
            placeholder="Beskriv problemet"
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
            className="h-full min-h-44 rounded-lg border border-black/50 bg-white/10 p-7 px-4 py-2 text-black required:border-red-500 required:text-red-500"
          />
          <div className="flex items-center gap-2 text-sm text-white">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="h-4 w-4"
            />
            <label>Skicka anonymt</label>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded border px-4 py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-full bg-blue-500 px-10 py-3 text-white"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTicketModal;
