import Link from "next/link";
import { getSession } from "~/server/better-auth/server";
import { HydrateClient } from "~/trpc/server";
import { FaBell } from "react-icons/fa";
import { CreateTicket } from "../../_components/createTicket";
import { MdArrowBack } from "react-icons/md";
import { redirect } from "next/navigation";
import { TicketTable } from "../../_components/ticketTable";

export default async function Handler() {
  const session = await getSession();

  // if (!session || session.user.role !== "HANDLER") {
  //   redirect("/");
  // }

  if (!session) {
    redirect("/");
  }

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col bg-linear-to-b from-[#2e026d] to-[#15162c] p-8 text-white">
        {/* Header */}
        <div className="mb-10 flex h-fit w-full flex-row items-center justify-end gap-4">
          <FaBell />
          <p className="text-center text-xl">
            {session && <span>Logged in as {session.user?.name}</span>}
          </p>
          <Link
            href="/"
            className="rounded-full bg-white/10 px-6 py-2 font-semibold no-underline transition hover:bg-white/20"
          >
            Sign out
          </Link>
        </div>
        {/* Content */}
        <div className="flex w-full flex-col items-center gap-y-10">
          <h1 className="text-6xl font-bold">Handler Dashboard</h1>

          <div className="w-full px-16">
            <TicketTable />
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
