"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "~/server/better-auth/client";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

    const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);

    const res = await authClient.signIn.email({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    });

    if (res.error) {
      setError(res.error.message || "Something went wrong.");

      return;

    }
    else {
          router.push("/dashboard");
    }
  }

  // const handleSubmit = async () => {
  //   console.log(email, password);

  //   await authClient.signIn.email(
  //     {
  //       email: "user@example.com",
  //       password:
  //         "$2b$10$iQkrNUSzqcPBEqwgLPvzTutz9giKhh6dFEaF/WFABKlMTyaKV754m",
  //       callbackURL: "/user",
  //       rememberMe: false,
  //     },
  //     {
  //       onRequest: (ctx) => {},
  //       onSuccess: (ctx) => {
  //         redirect("/user");
  //       },
  //       onError: (ctx) => {
  //         setError(ctx.error.message);
  //         console.log(ctx);
  //       },
  //     },
  //   );
  // };

  return (
    <main className="flex min-h-screen min-w-screen flex-col flex-wrap items-center justify-evenly bg-linear-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="lg:h-xl flex flex-col gap-2 rounded-lg bg-white/10 p-10 lg:w-xl">
        {error && (
          <div className="mb-4 rounded bg-red-500/20 p-3 text-red-200">
            {error}
          </div>
        )}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-center gap-2"
        >
          <label htmlFor="email">Email</label>
          <input
            type="text"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border border-black/50 bg-white/10 p-7 px-4 py-2 text-black required:border-red-500 required:text-red-500"
          />

          <label htmlFor="password">Lösenord</label>
          <input
            type="password"
            name="password"
            placeholder="Lösenord"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-lg border border-black/50 bg-white/10 p-7 px-4 py-2 text-black required:border-red-500 required:text-red-500"
          />
          <button
            className="mt-10 rounded-full bg-blue-500 px-10 py-3 text-white"
            type="submit"
          >
            Logga in
          </button>
          {/* <button
            className="mt-10 rounded-full bg-blue-500 px-10 py-3 text-white"
            formAction={handleSubmit}
          >
            Logga in
          </button> */}
        </form>
        <h3 className="mb-10 self-center">
          <Link href="/register">Glömt lösenord</Link>
        </h3>
      </div>
    </main>
  );
}

{
  /* <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
        formAction={async () => {
          "use server";
          const res = await auth.api.signInEmail({
            body: {
              email,
              password,
            },
            asResponse: true,
          });
          if (!res.url) {
            throw new Error("No URL returned from signInSocial");
          }
          redirect(res.url);
        }}
      >
        Sign in with Email
      </button> */
}
