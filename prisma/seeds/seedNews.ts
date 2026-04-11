import { db } from "~/server/db";

export async function seedNews() {
  const existing = await db.news.findFirst();

  if (existing) return;

  await db.news.createMany({
    data: [
      {
        id: "n1",
        title: "Våren 2026 kampanjstart",
        content:
          "Vårkampanjen 2026 startar den 15 mars. Säkerställ att kampanjmaterial och exponering är uppdaterad i alla butiker.",
        category: "CAMPAIGN",
        createdById: null,
        isPinned: true,
        isPublished: true,
        priority: "HIGH",
      },
      {
        id: "n2",
        title: "Ny rutin för fiskavdelningen",
        content:
          "En uppdaterad rutin för fiskavdelningen finns nu tillgänglig i butiksmanualen. Läs igenom innan nästa leverans.",
        category: "STORE_MANUAL",
        createdById: null,
        isPinned: false,
        isPublished: true,
        priority: "MEDIUM",
      },
      {
        id: "n3",
        title: "Produktnyhet: Ekologisk tugg",
        content:
          "Vi lanserar ekologisk tugg i alla butiker. Produktinformation, kampanjmaterial och prislistor finns nu tillgängliga.",
        category: "PRODUCT_INFORMATION",
        createdById: null,
        isPinned: false,
        isPublished: true,
        priority: "HIGH",
      },
      {
        id: "n4",
        title: "Uppdaterad arbetstidspolicy",
        content:
          "Arbetstidspolicyn har uppdaterats från och med 1 april. Läs igenom den nya versionen i intranätet.",
        category: "NEWS",
        createdById: null,
        isPinned: true,
        isPublished: true,
        priority: "LOW",
      },

      // 👇 EXTRA NYHETER

      {
        id: "n5",
        title: "Sommarkampanj planering startad",
        content:
          "Planeringen för sommarkampanjen 2026 är igång. Första materialleverans sker vecka 20.",
        category: "CAMPAIGN",
        createdById: null,
        isPinned: false,
        isPublished: true,
        priority: "HIGH",
      },
      {
        id: "n6",
        title: "Ny kassahantering i butikerna",
        content:
          "En uppdaterad kassaprocess införs stegvis under april. Se manual för detaljer.",
        category: "STORE_MANUAL",
        createdById: null,
        isPinned: false,
        isPublished: true,
        priority: "MEDIUM",
      },
      {
        id: "n7",
        title: "Produktinformation: Ny dryckesserie",
        content:
          "En ny ekologisk dryckesserie lanseras i sortimentet från och med nästa vecka.",
        category: "PRODUCT_INFORMATION",
        createdById: null,
        isPinned: false,
        isPublished: true,
        priority: "MEDIUM",
      },
      {
        id: "n8",
        title: "Intern uppdatering: HR-policy",
        content:
          "HR har uppdaterat riktlinjer kring ledighet och frånvaro. Kontrollera dokumentationen.",
        category: "NEWS",
        createdById: null,
        isPinned: false,
        isPublished: true,
        priority: "LOW",
      },
      {
        id: "n9",
        title: "Black Week förberedelser",
        content:
          "Förberedelser inför Black Week 2026 startar i maj. Kampanjmaterial skickas ut snart.",
        category: "CAMPAIGN",
        createdById: null,
        isPinned: true,
        isPublished: true,
        priority: "URGENT",
      },
      {
        id: "n10",
        title: "Ny utbildning för butikspersonal",
        content:
          "En ny digital utbildning för kundbemötande lanseras i systemet denna månad.",
        category: "NEWS",
        createdById: null,
        isPublished: true,
        isPinned: false,
        priority: "MEDIUM",
      },
    ],
  });

  console.log("📰 Seeded extended news dataset");
}
