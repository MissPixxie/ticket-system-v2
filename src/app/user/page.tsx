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

export default async function User() {
  const session = await getSession();
  console.log(session);

  if (!session) {
    redirect("/login");
  }

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-row flex-wrap items-center justify-center bg-linear-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="flex w-full grow flex-row place-content-end items-center gap-4">
          <FaBell />
          <p className="text-center text-2xl text-white">
            {session && <span>Logged in as {session.user?.email}</span>}
          </p>
          <Link
            href={session ? "/api/auth/signout" : "/api/auth/signin"}
            className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
          >
            {session ? "Sign out" : "Sign in"}
          </Link>
        </div>
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
        <div className="flex w-full max-w-xs grow flex-row justify-center gap-4 rounded-xl bg-white/10">
          <h3 className="text-8xl font-bold">IT</h3>
          <FaLaptop size={92} />
        </div>
        <div className="mt-15 flex h-full w-full grow place-content-center">
          <CreateTicket />
        </div>
        <MdArrowBack size={32} className="text-white" />
      </main>
    </HydrateClient>
  );
}
