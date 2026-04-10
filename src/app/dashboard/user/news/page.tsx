"use client";

import { api } from "~/trpc/react";
import { useState } from "react";
import { HiSpeakerphone, HiOutlineDocumentText } from "react-icons/hi";
import { MdCampaign } from "react-icons/md";

const dummyNews = [
  {
    id: "1",
    title: "Ny returpolicy för butiker",
    content:
      "Från och med nästa månad gäller en ny returpolicy som ska underlätta för kunderna. Läs mer om hur ni hanterar returer i butiken.",
    createdAt: new Date("2026-03-10"),
    category: "Policy",
  },
  {
    id: "2",
    title: "Ny leksak i sortimentet",
    content:
      "HQ introducerar en ny leksak som kommer finnas i sortimentet från och med nästa vecka. Se till att presentera den för kunder.",
    createdAt: new Date("2026-03-12"),
    category: "Produktnytt",
  },
  {
    id: "3",
    title: "Butikstävling startar",
    content:
      "En butikstävling startar nästa månad. Den butik som säljer flest utvalda produkter vinner en premie. Mer info kommer i nästa veckas nyhetsbrev.",
    createdAt: new Date("2026-03-14"),
    category: "Event",
  },
];

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

export default function NewsPage() {
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
        {/* NYHETER SEKTION */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <MdCampaign className="text-purple-400" size={36} />
            <h1 className="text-2xl font-bold tracking-wide">Nyheter</h1>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {dummyNews.map((item) => {
              const isSelected = selectedNewsId === item.id;
              return (
                <div
                  key={item.id}
                  className="flex cursor-pointer flex-col justify-between rounded-2xl bg-white/5 p-6 shadow-lg/15 backdrop-blur-lg transition hover:bg-white/10"
                  onClick={() => setSelectedNewsId(isSelected ? null : item.id)}
                >
                  <div>
                    <h2 className="text-lg font-semibold">{item.title}</h2>
                    <span className="text-sm text-white/60">
                      {item.createdAt.toLocaleDateString()}
                    </span>
                    {item.category && (
                      <p className="mt-1 text-xs text-white/50 uppercase">
                        {item.category}
                      </p>
                    )}

                    {isSelected && (
                      <p className="mt-3 text-sm text-white/80">
                        {item.content}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
