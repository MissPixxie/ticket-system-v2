"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "~/server/better-auth/client";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-10 bg-linear-to-b from-[#2e026d] to-[#15162c] px-4 text-white">
      <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
        Logga in
      </h1>

      <div className="w-full max-w-md rounded-3xl bg-white/5 p-10 shadow-xl backdrop-blur-lg transition hover:bg-white/10">
        {error && (
          <div className="mb-6 rounded-lg bg-red-500/20 p-3 text-center text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-white/80"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="email@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-white/20 bg-white/10 p-4 text-white placeholder-white/50 transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-white/80"
            >
              Lösenord
            </label>
            <input
              type="password"
              name="password"
              placeholder="Ditt lösenord"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-white/20 bg-white/10 p-4 text-white placeholder-white/50 transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full rounded-full bg-blue-500 px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Loggar in..." : "Logga in"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-white/60">
          <Link
            href="/forgotPassword"
            className="transition hover:text-blue-400"
          >
            Glömt lösenord?
          </Link>
        </div>
      </div>

      <div className="text-center text-sm text-white/50">
        © 2026 Företagsnamn
      </div>
    </div>
  );
}
