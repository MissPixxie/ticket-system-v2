// ~/app/_data/dummyNews.ts

export type Category =
  | "NEWS"
  | "STORE_MANUAL"
  | "PRODUCT_INFORMATION"
  | "CAMPAIGN";

export type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface DummyNews {
  newsId: string;
  title: string;
  content: string;
  category: Category;

  createdAt: Date;
  updatedAt: Date;

  createdById: string;
  createdBy: {
    id: string;
    name: string | null;
  };

  isPinned: boolean;
  isPublished: boolean;
  priority: Priority;
}

export const dummyNews: DummyNews[] = [
  {
    newsId: "n1",
    title: "Våren 2026 kampanjstart",
    content:
      "Våren 2026-kampanjen startar den 15:e mars. Se till att skyltar och kampanjmaterial är på plats.",
    category: "CAMPAIGN",

    createdAt: new Date("2026-03-01T08:00:00"),
    updatedAt: new Date("2026-03-01T08:00:00"),

    createdById: "admin1",
    createdBy: {
      id: "admin1",
      name: "Huvudkontoret",
    },

    isPinned: false,
    isPublished: true,
    priority: "LOW",
  },

  {
    newsId: "n2",
    title: "Ny rutin för fiskavdelningen",
    content:
      "En rutin för fiskavdelningen finns nu tillgänglig under butiksmanualen.",
    category: "STORE_MANUAL",

    createdAt: new Date("2026-03-02T09:30:00"),
    updatedAt: new Date("2026-03-02T09:30:00"),

    createdById: "admin2",
    createdBy: {
      id: "admin2",
      name: "Huvudkontoret",
    },

    isPinned: false,
    isPublished: true,
    priority: "MEDIUM",
  },

  {
    newsId: "n3",
    title: "Produktnyhet: Ekologisk tugg",
    content:
      "Vi lanserar nu ekologisk tugg i alla butiker. Produktinformation och prislistor finns i systemet.",
    category: "PRODUCT_INFORMATION",

    createdAt: new Date("2026-03-03T14:20:00"),
    updatedAt: new Date("2026-03-03T14:20:00"),

    createdById: "admin3",
    createdBy: {
      id: "admin3",
      name: "Huvudkontoret",
    },

    isPinned: false,
    isPublished: true,
    priority: "HIGH",
  },

  {
    newsId: "n4",
    title: "Interna nyheter: Uppdaterad arbetstidspolicy",
    content:
      "Arbetstidspolicyn har uppdaterats från och med 1:a april. Alla medarbetare uppmanas läsa den nya policyn.",
    category: "NEWS",

    createdAt: new Date("2026-03-04T11:45:00"),
    updatedAt: new Date("2026-03-04T11:45:00"),

    createdById: "admin1",
    createdBy: {
      id: "admin1",
      name: "Huvudkontoret",
    },

    isPinned: true,
    isPublished: true,
    priority: "LOW",
  },
];
