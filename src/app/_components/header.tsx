import Link from "next/link";
import { getSession } from "~/server/better-auth/server";
import { HydrateClient } from "~/trpc/server";
import { FaRegLightbulb } from "react-icons/fa";
import { GrBug } from "react-icons/gr";
import { redirect } from "next/navigation";
import { NotificationBell } from "~/app/_components/notificationBell";

export default async function Header() {
  const session = await getSession();
  if (!session) {
    redirect("/");
  }

  return (
    <HydrateClient>
      <header className="flex h-fit w-full grow flex-row place-content-end items-center gap-4 bg-linear-to-b from-[#2e026d] to-[#15162c] px-5 py-3 shadow-md/80">
        <div>
          <FaRegLightbulb size={22} />
        </div>
        <NotificationBell userId={session.user.id} />
        <p className="text-center text-2xl text-white">
          <span>Logged in as {session.user.name}</span>
        </p>
        <Link
          href={"/"}
          className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
        >
          Sign out
        </Link>
      </header>
    </HydrateClient>
  );
}
