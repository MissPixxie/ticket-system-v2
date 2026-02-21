"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "~/server/better-auth/client";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // Ny state

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { data, error: resError } = await authClient.signIn.email({
      email,
      password,
    });

    if (resError) {
      setError(resError.message || "Ett fel uppstod.");
      setLoading(false);
    } else {
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
    <div
      className="lg:h-xl flex flex-col gap-2 rounded-lg bg-white/10 p-10 lg:w-xl"
      suppressHydrationWarning={true}
    >
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
          type="email"
          name="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-lg border border-black/50 bg-white/10 p-7 px-4 py-2 text-black required:border-red-500 required:text-red-500"
        />

        <label htmlFor="password">Lösenord</label>
        <input
          type="password"
          name="password"
          required
          placeholder="Lösenord"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-lg border border-black/50 bg-white/10 p-7 px-4 py-2 text-black required:border-red-500 required:text-red-500"
        />
        <button
          disabled={loading}
          className="mt-10 rounded-full bg-blue-500 px-10 py-3 text-white"
          type="submit"
        >
          {loading ? "Loggar in..." : "Logga in"}
        </button>
      </form>
      <h3 className="mb-10 self-center">
        <Link href="/forgotPassword">Glömt lösenord</Link>
      </h3>
    </div>
  );
}
