import Link from "next/link";
import { getSession } from "~/server/better-auth/server";
import { HydrateClient } from "~/trpc/server";
import { FaRegLightbulb } from "react-icons/fa";
import { GrBug } from "react-icons/gr";
import { redirect } from "next/navigation";
import { NotificationBell } from "~/app/_components/notificationBell";
import { SignOutButton } from "./signOutButton";

export default async function Header() {
  const session = await getSession();
  if (!session) {
    redirect("/");
  }

  return (
    <HydrateClient>
      <header className="flex h-fit w-full grow flex-row place-content-end items-center gap-4 bg-linear-to-b from-[#2e026d] to-[#15162c] px-5 py-3 shadow-md/80">
        <NotificationBell />
        <p className="text-center text-2xl text-white">
          <span>Logged in as {session.user.name}</span>
        </p>
        <SignOutButton />
      </header>
    </HydrateClient>
  );
}
