import Link from "next/link";
import { getSession } from "~/server/better-auth/server";
import { HydrateClient } from "~/trpc/server";
import {
  FaBell,
  FaHandHoldingHeart,
  FaLaptop,
  FaShopify,
  FaShoppingCart,
  FaUsers,
} from "react-icons/fa";
import { CreateTicket } from "../../_components/createTicket";
import { MdArrowBack } from "react-icons/md";
import { redirect } from "next/navigation";
import { SuggestionBox } from "~/app/_components/suggestionBox";

export default async function User() {
  const session = await getSession();
  console.log(session);
  // if (!session || session.user.role !== "USER") {
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
        <div className="flex h-screen w-full justify-items-center">
          <CreateTicket />
        </div>
      </main>
      <aside className="fixed top-0 left-0 h-full w-64 bg-gray-800 p-4 text-white">
        <SuggestionBox />
      </aside>
    </HydrateClient>
  );
}
