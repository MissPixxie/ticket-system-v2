"use client";

import { useState } from "react";
import CreateTicketModal from "./createTicketModal";
import { useCreateTicket } from "./useCreateTicket";

export function TicketSection() {
  const [isOpen, setIsOpen] = useState(false);
  const { createTicket, isLoading } = useCreateTicket();

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Create Ticket</button>

      <CreateTicketModal
        isOpen={isOpen}
        onClose={() => {
            console.log("Closing modal!");
            setIsOpen(false)}}
        onSubmit={(data) => {
          createTicket(data);
          setIsOpen(false);
        }}
      />
    </>
  );
}
