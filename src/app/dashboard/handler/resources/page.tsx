"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { ImBooks } from "react-icons/im";
import ResourcesCard from "~/app/_components/cards/resourceCard";

export default function ResourcesPage() {
  const utils = api.useUtils();
  const [urlError, setUrlError] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<
    "DOCUMENTATION" | "TUTORIAL" | "INFORMATION" | "OTHER"
  >("OTHER");
  const [url, setUrl] = useState<string>("");
  const { data: resources = [], isLoading } =
    api.resource.listResources.useQuery({ limit: 5 });

  const isValidUrl = (value: string) => {
    try {
      new URL(value);
      setUrlError(null);
      return true;
    } catch {
      setUrlError(
        "Ogiltig URL. Kontrollera att du skriver in en korrekt webbadress.",
      );
      return false;
    }
  };

  const createResource = api.resource.createResource.useMutation({
    onSuccess: async () => {
      await utils.resource.invalidate();
      setTitle("");
      setDescription("OTHER");
      setUrl("");
    },
  });

  const handleCreate = () => {
    if (!title || !url) return;

    if (!isValidUrl(url)) return;

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
    <main className="main-page-layout">
      <div className="container">
        <div className="header-container">
          <ImBooks className="text-purple-400" size={36} />
          <h1 className="page-header">Resurser & dokumentation</h1>
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
            <select
              value={category}
              onChange={(e) =>
                setCategory(
                  e.target.value as
                    | "DOCUMENTATION"
                    | "TUTORIAL"
                    | "INFORMATION"
                    | "OTHER",
                )
              }
              className="rounded-lg bg-white/10 px-4 py-2 text-white outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="DOCUMENTATION" className="text-black">
                Dokumentation
              </option>
              <option value="TUTORIAL" className="text-black">
                Tutorial
              </option>
              <option value="INFORMATION" className="text-black">
                Information
              </option>
              <option value="OTHER" className="text-black">
                Övrigt
              </option>
            </select>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Länk till dokument (URL)"
              className="rounded-lg bg-black/30 p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
            {urlError && (
              <p className="mt-2 text-sm text-red-500">{urlError}</p>
            )}
            <button onClick={handleCreate} className="submit-button">
              Skapa resurs
            </button>
          </div>
        </div>

        {/* RESOURCE LIST */}
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {resources.map((item) => (
            <ResourcesCard key={item.id} resourceItem={item} />
          ))}
        </div>
      </div>
    </main>
  );
}
