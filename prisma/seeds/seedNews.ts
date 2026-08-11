import { db } from "~/server/db";
import { NewsCategory } from "@prisma/client";
import { createEmbedding } from "~/server/ai/createEmbedding";
import type { Priority } from "~/app/_components/modals/edit-news/editNewsModal";
import { generateTags } from "~/server/ai/generateTags";

export async function seedNews() {
  type SeedNews = {
    title: string;
    content: string;
    category: NewsCategory;
    priority: Priority;
  };

  const newsItems: SeedNews[] = [
    {
      title: "Våren 2026 kampanjstart",
      content:
        "Vårkampanjen 2026 startar den 15 mars och pågår under våren. Kampanjmaterial, skyltning och exponering ska vara uppdaterade inför kampanjstart i alla butiker. Kontrollera att rätt priser och kampanjprodukter är inlagda i butikssystemet och att materialet finns på plats innan kampanjen börjar.",
      category: "CAMPAIGN",
      priority: "HIGH",
    },

    {
      title: "Ny rutin för fiskavdelningen",
      content:
        "En uppdaterad rutin för fiskavdelningen finns nu tillgänglig i butiksmanualen. Den nya rutinen beskriver bland annat dagliga kontroller, vattenvärden, skötsel och dokumentation. Alla medarbetare som arbetar med fisk ska läsa igenom rutinen innan nästa leverans.",
      category: "STORE_MANUAL",
      priority: "MEDIUM",
    },

    {
      title: "Produktnyhet: Ekologisk tugg",
      content:
        "Vi lanserar en ny serie ekologiska tuggprodukter i alla butiker. Produktinformation, rekommenderade priser och kampanjmaterial finns nu tillgängliga i systemet. Kontrollera att produkterna är korrekt registrerade och att rätt pris och exponering används vid lanseringen.",
      category: "PRODUCT_INFORMATION",
      priority: "HIGH",
    },

    {
      title: "Uppdaterad arbetstidspolicy",
      content:
        "Arbetstidspolicyn har uppdaterats från och med 1 april. Den nya policyn innehåller uppdaterade riktlinjer kring arbetstider, schemaläggning och frånvaro. Alla medarbetare ska läsa igenom den nya versionen som finns publicerad på intranätet.",
      category: "NEWS",
      priority: "LOW",
    },

    {
      title: "Sommarkampanj planering startad",
      content:
        "Planeringen för sommarkampanjen 2026 är nu igång. Första leveransen av kampanjmaterial planeras till vecka 20 och innehåller skyltmaterial, exponering och information om kampanjprodukterna. Butikerna behöver säkerställa att det finns tillräckligt med plats för kampanjexponeringen innan materialet anländer.",
      category: "CAMPAIGN",
      priority: "HIGH",
    },

    {
      title: "Ny kassahantering i butikerna",
      content:
        "En uppdaterad kassaprocess införs stegvis under april. Förändringen innehåller nya rutiner för bland annat returer, prisjusteringar och hantering av vissa betalningsproblem. Läs den uppdaterade manualen innan den nya processen börjar användas i butiken.",
      category: "STORE_MANUAL",
      priority: "MEDIUM",
    },

    {
      title: "Produktinformation: Ny dryckesserie",
      content:
        "En ny ekologisk dryckesserie lanseras i sortimentet från och med nästa vecka. Produkterna kommer att finnas i flera varianter och ska registreras med rätt produktinformation och priser. Kontrollera produktregistret och den tillhörande produktguiden inför lanseringen.",
      category: "PRODUCT_INFORMATION",
      priority: "MEDIUM",
    },

    {
      title: "Intern uppdatering: HR-policy",
      content:
        "HR har uppdaterat riktlinjerna kring ledighet och frånvaro. Den nya informationen innehåller förtydliganden kring hur ledighet ska registreras och hur frånvaro ska rapporteras till ansvarig chef. Den fullständiga policyn finns tillgänglig på intranätet och bör läsas igenom av all personal.",
      category: "NEWS",
      priority: "LOW",
    },

    {
      title: "Black Week förberedelser",
      content:
        "Förberedelserna inför Black Week 2026 startar i maj. Kampanjen kommer att innehålla ett större antal produkter och kräver planering av priser, lager, exponering och kampanjmaterial. Mer detaljerad information om produkter och kampanjperiod kommer att publiceras när planeringen är klar.",
      category: "CAMPAIGN",
      priority: "URGENT",
    },

    {
      title: "Ny utbildning för butikspersonal",
      content:
        "En ny digital utbildning för kundbemötande lanseras i systemet denna månad. Utbildningen innehåller moment kring kunddialog, behovsanalys, produktrekommendationer och hur man hanterar vanliga kundfrågor. Alla medarbetare kommer att kunna genomföra utbildningen via utbildningssektionen i systemet.",
      category: "NEWS",
      priority: "MEDIUM",
    },
  ];

  const admin = await db.user.findFirst({
    where: {
      email: "admin@example.com",
    },
  });

  if (!admin) {
    throw new Error("Admin user not found");
  }

  for (const item of newsItems) {
    const tags = await generateTags(`${item.title}\n\n${item.content}`);
    const conversation = await db.conversation.create({
      data: {},
    });

    const embeddingText = `
Title: ${item.title}

Category: ${item.category}

Priority: ${item.priority}

Content:
${item.content}
`;

    const embedding = await createEmbedding(embeddingText);

    const news = await db.news.create({
      data: {
        title: item.title,
        content: item.content,
        category: item.category,
        createdById: admin.id,
        isPublished: true,
        isPinned: false,
        priority: item.priority,
        conversationId: conversation.id,
        embedding: JSON.stringify(embedding),
        tags: {
          connectOrCreate: tags.map((tag: string) => ({
            where: { name: tag },
            create: { name: tag },
          })),
        },
      },
    });

    console.log(news);
  }
  console.log("📰 Seeded extended news dataset");
}
