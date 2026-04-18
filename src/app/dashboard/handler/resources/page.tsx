"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

export default function ResourcesPage() {
  const utils = api.useUtils();

  const { data: resources = [], isLoading } =
    api.resource.listResources.useQuery({ limit: 5 });

  const createResource = api.resource.createResource.useMutation({
    onSuccess: async () => {
      await utils.resource.invalidate();
      setTitle("");
      setDescription("OTHER");
      setUrl("");
    },
  });

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<
    "DOCUMENTATION" | "TUTORIAL" | "INFORMATION" | "OTHER"
  >("OTHER");
  const [url, setUrl] = useState<string>("");

  const handleCreate = () => {
    if (!title || !url) return;

    createResource.mutate({
      title,
      description,
      category,
      url,
    });
  };

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center text-white/70">
        Laddar resurser...
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-12 text-white">
      <div className="mx-auto w-full max-w-6xl">
        <h1 className="mb-8 text-2xl font-bold tracking-wide">
          Resurser & Dokumentation
        </h1>

        {/* STATS */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl bg-white/5 p-6 backdrop-blur-lg hover:bg-white/10">
            <p className="text-sm text-white/60">Totala resurser</p>
            <p className="mt-2 text-3xl font-bold">{resources.length}</p>
          </div>
        </div>

        {/* CREATE FORM */}
        <div className="mb-10 rounded-2xl bg-white/5 p-6 backdrop-blur-lg">
          <h2 className="mb-4 text-lg font-semibold">Skapa ny resurs</h2>

          <div className="flex flex-col gap-4">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titel"
              className="rounded-lg bg-black/30 p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Beskrivning"
              rows={3}
              className="rounded-lg bg-black/30 p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Länk till dokument (URL)"
              className="rounded-lg bg-black/30 p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button onClick={handleCreate} className="submit-button">
              Skapa resurs
            </button>
          </div>
        </div>

        {/* RESOURCE LIST */}
        <div className="grid gap-4">
          {resources.map((res) => (
            <div
              key={res.id}
              className="rounded-2xl bg-white/5 p-5 backdrop-blur-lg transition hover:bg-white/10"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{res.title}</h3>
                <a
                  href={res.url || "#"}
                  target="_blank"
                  className="text-sm text-blue-400 hover:underline"
                >
                  Öppna
                </a>
              </div>

              {res.description && (
                <p className="mt-2 text-sm text-white/70">{res.description}</p>
              )}

              <div className="mt-3 text-xs text-white/40">
                {new Date(res.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
