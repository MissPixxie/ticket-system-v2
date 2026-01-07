"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import {
  FaBell,
  FaHandHoldingHeart,
  FaLaptop,
  FaShopify,
  FaShoppingCart,
  FaUsers,
} from "react-icons/fa";

export function CreateTicket() {
  const utils = api.useUtils();
  const [title, setTitle] = useState("");
  const [issue, setIssue] = useState("");
  const [department, setDepartment] = useState<
    "IT" | "HR" | "CAMPAIGN" | "PRODUCT" | "CUSTOMERCLUB"
  >("IT");
  // const [clicked, setClicked] = useState(false);
  const [isSelected, setIsSelected] = useState<null | number>(null);

  const createTicket = api.ticket.create.useMutation({
    onSuccess: async () => {
      await utils.ticket.invalidate();
      setTitle("");
      setIssue("");
      setDepartment("IT");
      setIsSelected(null);
      // setClicked(false);
    },
  });

  const departments = [
    { id: 1, name: "IT", icon: <FaLaptop size={42} />, isSelected: false },
    { id: 2, name: "HR", icon: <FaUsers size={42} />, isSelected: false },
    {
      id: 3,
      name: "CAMPAIGN",
      icon: <FaShopify size={42} />,
      isSelected: false,
    },
    {
      id: 4,
      name: "PRODUCT",
      icon: <FaShoppingCart size={42} />,
      isSelected: false,
    },
    {
      id: 5,
      name: "CUSTOMERCLUB",
      icon: <FaHandHoldingHeart size={42} />,
      isSelected: false,
    },
  ];

  return (
    <div className="flex h-full w-full flex-col items-center gap-15">
      <h1 className="text-4xl">Välj avdelning</h1>
      <div className="grid grid-cols-5 gap-4 sm:grid-cols-5 md:gap-8">
        {departments.map((dep) => {
          return (
            <button
              key={dep.id}
              onClick={() => {
                setDepartment(dep.name as typeof department);
                setIsSelected(dep.id);
              }}
              className={`flex max-w-xs flex-col items-center gap-4 rounded-xl p-4 transition-all duration-300 ${isSelected === dep.id ? "scale-110 bg-blue-500 text-white" : isSelected !== null ? "notSelected" : "bg-white/10 hover:bg-white/20"}`}
            >
              <h3 className="text-2xl font-bold">{dep.name}</h3>
              {dep.icon}
            </button>
          );
        })}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createTicket.mutate({ title, issue, department });
        }}
        className="flex flex-col gap-2 lg:h-80 lg:w-3xl"
      >
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
          className="h-full rounded-lg border border-black/50 bg-white/10 p-7 px-4 py-2 text-black required:border-red-500 required:text-red-500"
        />
        <button
          type="submit"
          className="rounded-full bg-blue-500 px-10 py-3 text-white"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
