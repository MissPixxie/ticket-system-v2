import Link from "next/link";
import { getSession } from "~/server/better-auth/server";
import { HydrateClient } from "~/trpc/server";
import { FaBell } from "react-icons/fa";
import { redirect } from "next/navigation";
import { CreateUser } from "~/app/_components/createUser";
import { ListAllUsers } from "~/app/_components/listAllUsers";
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
        <div className="flex h-fit w-full grow flex-row place-content-end items-center gap-4">
          <FaBell />
          <p className="text-center text-2xl text-white">
            <span>Logged in as {user?.name}</span>
          </p>
          <Link
            href={"/"}
            className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
          >
            Sign out
          </Link>
        </div>
        <div className="flex w-full flex-col place-items-center">
          <h3 className="text-8xl font-bold">Admin Dashboard</h3>
          <ListAllUsers />
          <CreateUser />
        </div>
      </main>
    </HydrateClient>
  );
}
