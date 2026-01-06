import Link from "next/link";
import { getSession } from "~/server/better-auth/server";
import { HydrateClient } from "~/trpc/server";
import { FaBell } from "react-icons/fa";
import { redirect } from "next/navigation";

export default async function Admin() {
  const session = await getSession();

  // if (!session || session.user.role !== "ADMIN") {
  //   redirect("/");
  // }

  if (!session) {
    redirect("/");
  }
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-row flex-wrap items-center justify-center bg-linear-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="flex w-full grow flex-row place-content-end items-center gap-4">
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
        <div className="flex w-full max-w-xs grow flex-row justify-center gap-4 rounded-xl bg-white/10">
          <h3 className="text-8xl font-bold">Admin Dashboard</h3>
        </div>
      </main>
    </HydrateClient>
  );
}
