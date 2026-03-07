"use client";

import { useState } from "react";
import CreateTicketModal from "./createTicketModal";
import { useCreateTicket } from "./useCreateTicket";

export function TicketSection() {
  const [isOpen, setIsOpen] = useState(false);
  const { createTicket, isLoading } = useCreateTicket();

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="ml-auto rounded-md bg-linear-to-r from-purple-700 to-indigo-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
      >
        Create Ticket
      </button>

      <CreateTicketModal
        isOpen={isOpen}
        onClose={() => {
          console.log("Closing modal!");
          setIsOpen(false);
        }}
        onSubmit={(data) => {
          createTicket(data);
          setIsOpen(false);
        }}
      />
    </>
  );
}
