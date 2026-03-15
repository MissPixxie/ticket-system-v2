// ~/app/_data/dummyNews.ts

export interface DummyNews {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  category: "Nyheter" | "Butiksmanual" | "Produktinformation" | "Kampanjer";
  author: {
    id: string;
    name: string;
  };
}

export const dummyNews: DummyNews[] = [
  {
    id: "n1",
    title: "Våren 2026 kampanjstart",
    content:
      "Våren 2026-kampanjen startar den 15:e mars. Se till att skyltar och kampanjmaterial är på plats.",
    createdAt: new Date("2026-03-01T08:00:00"),
    category: "Kampanjer",
    author: { id: "admin1", name: "Huvudkontoret" },
  },
  {
    id: "n2",
    title: "Ny manual för kaffemaskiner",
    content:
      "En uppdaterad manual för alla nya kaffemaskiner finns nu tillgänglig under Butiksmanual.",
    createdAt: new Date("2026-03-02T09:30:00"),
    category: "Butiksmanual",
    author: { id: "admin2", name: "Huvudkontoret" },
  },
  {
    id: "n3",
    title: "Produktnyhet: Ekologisk choklad",
    content:
      "Vi lanserar nu ekologisk choklad i alla butiker. Produktinformation och prislistor finns i systemet.",
    createdAt: new Date("2026-03-03T14:20:00"),
    category: "Produktinformation",
    author: { id: "admin3", name: "Huvudkontoret" },
  },
  {
    id: "n4",
    title: "Interna nyheter: Uppdaterad arbetstidspolicy",
    content:
      "Arbetstidspolicyn har uppdaterats från och med 1:a april. Alla medarbetare uppmanas läsa den nya policyn.",
    createdAt: new Date("2026-03-04T11:45:00"),
    category: "Nyheter",
    author: { id: "admin1", name: "Huvudkontoret" },
  },
];
