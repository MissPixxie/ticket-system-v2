"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { MessagesTable } from "~/app/_components/messagesTable";
import { LuMessageSquareText } from "react-icons/lu";
import { Department } from "@prisma/client";
import {
  FaLaptop,
  FaUsers,
  FaShopify,
  FaShoppingCart,
  FaHandHoldingHeart,
} from "react-icons/fa";

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

export default function MessagePage() {
  const [selectedDepartments, setSelectedDepartments] = useState<Department[]>(
    [],
  );
  const utils = api.useUtils();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [newMessage, setNewMessage] = useState("");

  function handleDepartmentChange(dep: Department) {
    setSelectedDepartments((prev) =>
      prev.includes(dep) ? prev.filter((d) => d !== dep) : [...prev, dep],
    );
  }

  const createMessage = api.message.createMessage.useMutation({
    onSuccess: () => {
      utils.message.listMessages.invalidate();
    },
  });

  const handleSend = () => {
    if (!newMessage.trim()) return;

    //createMessage.mutate({ threadId, message: newMessage });
    setNewMessage("");
  };

  return (
    <main className="main-page-layout">
      <div className="container">
        <div className="header-container">
          <LuMessageSquareText className="text-purple-400" size={36} />
          <h1 className="page-header">Meddelande</h1>
        </div>

        {/* Skapa nyhet */}
        <div className="rounded-2xl bg-white/5 p-6 shadow-lg/15 backdrop-blur-lg">
          <h2 className="mb-4 text-xl font-semibold">Skapa ny nyhet</h2>

          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Titel"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-lg bg-white/10 px-4 py-2 text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              placeholder="Innehåll"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="resize-none rounded-lg bg-white/10 px-4 py-2 text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div>
              <p className="mb-4 text-center text-lg">Avdelningar</p>

              <div className="grid grid-cols-2 gap-4">
                {departments.map((dep) => {
                  const isSelected = selectedDepartments.includes(dep.value);

                  return (
                    <button
                      key={dep.value}
                      type="button"
                      onClick={() => handleDepartmentChange(dep.value)}
                      className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-3 transition-all duration-200 ${
                        isSelected
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
            <button
              onClick={handleSend}
              className="cursor-pointer self-start rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
            >
              Skicka meddelande
            </button>
          </div>
        </div>
        <MessagesTable />
      </div>
    </main>
  );
}
