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
          <div className="flex flex-row items-center justify-center gap-10">
            <div className="h-50 w-50 rounded-lg bg-blue-200">
              Totala tickets
            </div>
            <div className="h-50 w-50 rounded-lg bg-green-200">Nya tickets</div>
            <div className="h-50 w-50 rounded-lg bg-amber-200">
              Pågående tickets
            </div>
            <div className="h-50 w-50 rounded bg-red-200">Stängda tickets</div>
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
