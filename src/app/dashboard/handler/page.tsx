import { getSession } from "~/server/better-auth/server";
import { HydrateClient } from "~/trpc/server";
import { redirect } from "next/navigation";
import { TicketTable } from "../../_components/ticketTable";
import { SuggestionBox } from "~/app/_components/suggestionBox";
import { db } from "~/server/db";
import Header from "~/app/_components/header";

export default async function Handler() {
  const session = await getSession();

  if (!session) {
    redirect("/");
  }
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: { role: true },
  });

  if (!user || user?.role?.name !== "HANDLER") {
    redirect("/");
  }
  return (
    <HydrateClient>
      <Header />
      <div className="flex min-h-screen w-screen flex-row-reverse flex-wrap bg-linear-to-b from-[#2e026d] to-[#15162c] text-white">
        <TicketTable currentUserId={session.user.id} />

        <aside>
          <SuggestionBox />
        </aside>
      </div>
    </HydrateClient>
  );
}
