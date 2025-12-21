import Link from "next/link";
import { getSession } from "~/server/better-auth/server";
import { api, HydrateClient } from "~/trpc/server";
import {
  FaBell,
  FaHandHoldingHeart,
  FaLaptop,
  FaShopify,
  FaShoppingCart,
  FaUsers,
} from "react-icons/fa";
import { CreateTicket } from "../_components/createTicket";
import { MdArrowBack } from "react-icons/md";
import { redirect } from "next/navigation";

export default async function Handler() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="flex flex-row items-center justify-center gap-4 self-end">
          <FaBell />
          <p className="text-center text-2xl text-white">
            {session && <span>Logged in as {session.user?.name}</span>}
          </p>
          <Link
            href={session ? "/api/auth/signout" : "/api/auth/signin"}
            className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
          >
            {session ? "Sign out" : "Sign in"}
          </Link>
        </div>
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Ticket system
          </h1>
          <div className="grid grid-cols-5 gap-4 sm:grid-cols-5 md:gap-8">
            <Link
              className="flex max-w-xs flex-col items-center gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
              href="http://localhost:3000/it"
              target="_blank"
            >
              <h3 className="text-2xl font-bold">IT</h3>
              <FaLaptop size={42} />
            </Link>
            <Link
              className="flex max-w-xs flex-col items-center gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
              href="https://create.t3.gg/en/introduction"
              target="_blank"
            >
              <h3 className="text-2xl font-bold">HR</h3>
              <FaUsers size={42} />
            </Link>
            <Link
              className="flex max-w-xs flex-col items-center gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
              href="https://create.t3.gg/en/introduction"
              target="_blank"
            >
              <h3 className="text-2xl font-bold">Kampanj</h3>
              <FaShopify size={42} />
            </Link>
            <Link
              className="flex max-w-xs flex-col items-center gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
              href="https://create.t3.gg/en/introduction"
              target="_blank"
            >
              <h3 className="text-2xl font-bold">Produkt</h3>
              <FaShoppingCart size={42} />
            </Link>
            <Link
              className="flex max-w-xs flex-col items-center gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
              href="https://create.t3.gg/en/introduction"
              target="_blank"
            >
              <h3 className="text-2xl font-bold">Kundklubb</h3>
              <FaHandHoldingHeart size={42} />
            </Link>
          </div>
          {/*
          {session?.user && <LatestPost />} */}
        </div>
      </main>
    </HydrateClient>
  );
}
