import { HydrateClient } from "~/trpc/server";
import SignInForm from "./_components/signInForm";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="flex min-h-screen min-w-screen flex-col flex-wrap items-center justify-evenly bg-linear-to-b from-[#2e026d] to-[#15162c] text-white">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Logga in
        </h1>
        <SignInForm />
      </main>
    </HydrateClient>
  );
}
