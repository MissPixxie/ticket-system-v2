import Link from "next/link";
import { getSession } from "~/server/better-auth/server";
import { HydrateClient } from "~/trpc/server";
import { FaRegLightbulb } from "react-icons/fa";
import { GrBug } from "react-icons/gr";
import { redirect } from "next/navigation";
import { SuggestionBox } from "~/app/_components/suggestionBox";
import { NotificationBell } from "~/app/_components/notificationBell";
import { db } from "~/server/db";
import { MyTicketsTable } from "~/app/_components/myTicketsTable";
import { TicketSection } from "~/app/_components/create-ticket/ticketSection";
import Header from "~/app/_components/header";

export default async function User() {
  const session = await getSession();

  if (!session) {
    redirect("/");
  }
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: { role: true },
  });

  if (!user || user?.role?.name !== "USER") {
    redirect("/");
  }

  return (
    <HydrateClient>
      <Header />
      <div className="flex min-h-screen w-screen flex-row-reverse flex-wrap bg-linear-to-b from-[#2e026d] to-[#15162c] text-white">
        <MyTicketsTable currentUserId={session.user.id} />

        <aside>
          <SuggestionBox />
        </aside>
      </div>
    </HydrateClient>
  );
}
