"use client";

import { TicketTable } from "~/app/_components/ticketTable";
import { TiTicket } from "react-icons/ti";

export default function MyTicketsPage() {
  return (
    <main className="main-page-layout">
      <div className="container">
        <div className="header-container">
          <TiTicket className="text-purple-400" size={36} />
          <h1 className="page-header">Mina tickets</h1>
        </div>
        <TicketTable currentUserRole="USER" />
      </div>
    </main>
  );
}
