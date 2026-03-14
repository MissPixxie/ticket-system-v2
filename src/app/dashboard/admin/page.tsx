import { getSession } from "~/server/better-auth/server";
import { HydrateClient } from "~/trpc/server";
import { redirect } from "next/navigation";
import { db } from "~/server/db";

export default async function Admin() {
  const session = await getSession();

  if (!session) {
    redirect("/");
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: { role: true },
  });

  if (!user || user?.role?.name !== "ADMIN") {
    redirect("/");
  }

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-row flex-wrap bg-linear-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="flex w-full flex-col place-items-center">
          <h3 className="text-8xl font-bold">Admin Dashboard</h3>
        </div>
      </main>
    </HydrateClient>
  );
}
