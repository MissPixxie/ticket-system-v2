import Link from "next/link";
import { getSession } from "~/server/better-auth/server";
import { HydrateClient } from "~/trpc/server";
import {
  FaBell,
  FaRegLightbulb,
  FaHandHoldingHeart,
  FaLaptop,
  FaShopify,
  FaShoppingCart,
  FaUsers,
} from "react-icons/fa";
import { GrBug } from "react-icons/gr";
import { CreateTicket } from "../../_components/createTicket";
import { MdArrowBack } from "react-icons/md";
import { redirect } from "next/navigation";
import { SuggestionBox } from "~/app/_components/suggestionBox";
import { NotificationBell } from "~/app/_components/notificationBell";
import { db } from "~/server/db";

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
      <main className="flex min-h-screen flex-row flex-wrap bg-linear-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="flex h-fit w-full grow flex-row place-content-end items-center gap-4">
          <div>
            <Link href="/dashboard/user/bug">
              <GrBug size={22} />
            </Link>
          </div>
          <div>
            <FaRegLightbulb size={22} />
          </div>
          <NotificationBell userId={session.user.id} />
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
        <div className="flex h-screen w-full justify-items-center">
          <CreateTicket />
        </div>
      </main>
      <aside>
        <SuggestionBox />
      </aside>
    </HydrateClient>
  );
}
