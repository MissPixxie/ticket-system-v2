import Link from "next/link";
import { getSession } from "~/server/better-auth/server";
import { HydrateClient } from "~/trpc/server";
import { FaBell } from "react-icons/fa";
import { CreateTicket } from "../../_components/createTicket";
import { MdArrowBack } from "react-icons/md";
import { redirect } from "next/navigation";
import { ListAllTickets } from "~/app/_components/listAllTickets";

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
      <main className="flex min-h-screen flex-row flex-wrap bg-linear-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="flex h-fit w-full grow flex-row place-content-end items-center gap-4">
          <FaBell />
          <p className="text-center text-2xl text-white">
            {session && <span>Logged in as {session.user?.name}</span>}
          </p>
          <Link
            href={session ? "/" : "/"}
            className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
          >
            {session ? "Sign out" : "Sign in"}
          </Link>
        </div>
        <div className="flex w-full flex-col place-items-center">
          <h3 className="text-8xl font-bold">Handler Dashboard</h3>
          <ListAllTickets />
        </div>
      </main>
    </HydrateClient>
  );
}
