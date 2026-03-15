import Link from "next/link";
import { getSession } from "~/server/better-auth/server";
import { HydrateClient } from "~/trpc/server";
import { FaRegLightbulb } from "react-icons/fa";
import { GrBug } from "react-icons/gr";
import { redirect } from "next/navigation";
import { NotificationBell } from "~/app/_components/notificationBell";
import { db } from "~/server/db";
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
    </HydrateClient>
  );
}
