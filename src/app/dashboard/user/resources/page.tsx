"use client";

import { api } from "~/trpc/react";
import { useState } from "react";
import { HiSpeakerphone, HiOutlineDocumentText } from "react-icons/hi";
import { MdCampaign } from "react-icons/md";

const dummyResources = [
  {
    id: "r1",
    title: "Butiksmanual",
    description: "Allmän information och riktlinjer för butiksarbete.",
    link: "#",
  },
  {
    id: "r2",
    title: "Produktinformation",
    description: "Detaljer om produkter, priser och kampanjer.",
    link: "#",
  },
  {
    id: "r3",
    title: "Säkerhetsföreskrifter",
    description: "Rutiner och riktlinjer för säkerhet i butiken.",
    link: "#",
  },
];

export default function ResourcesPage() {
  //const { data: news, isLoading } = api.news.listAll.useQuery();
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);

  //   if (isLoading) {
  //     return (
  //       <main className="flex min-h-screen items-center justify-center text-white/70">
  //         Laddar nyheter...
  //       </main>
  //     );
  //   }

  //   if (!news || news.length === 0) {
  //     return (
  //       <main className="flex min-h-screen items-center justify-center text-white/70">
  //         Inga nyheter hittades
  //       </main>
  //     );
  //   }

  return (
    <main className="min-h-screen px-6 py-12 text-white">
      <div className="mx-auto max-w-7xl space-y-12">
        {/* RESURSER SEKTION */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <HiOutlineDocumentText className="text-purple-400" size={28} />
            <h1 className="text-2xl font-bold tracking-wide">Butiksresurser</h1>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {dummyResources.map((item) => (
              <a
                key={item.id}
                href={item.link}
                className="flex cursor-pointer flex-col justify-between rounded-2xl bg-white/5 p-6 shadow-lg/15 backdrop-blur-lg transition hover:bg-white/10"
              >
                <h2 className="text-lg font-semibold">{item.title}</h2>
                <p className="mt-2 text-sm text-white/70">{item.description}</p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
