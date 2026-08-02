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
        "Vårkampanjen 2026 startar den 15 mars. Säkerställ att kampanjmaterial och exponering är uppdaterad i alla butiker.",
      category: "CAMPAIGN",
      priority: "HIGH",
    },
    {
      title: "Ny rutin för fiskavdelningen",
      content:
        "En uppdaterad rutin för fiskavdelningen finns nu tillgänglig i butiksmanualen. Läs igenom innan nästa leverans.",
      category: "STORE_MANUAL",
      priority: "MEDIUM",
    },
    {
      title: "Produktnyhet: Ekologisk tugg",
      content:
        "Vi lanserar ekologisk tugg i alla butiker. Produktinformation, kampanjmaterial och prislistor finns nu tillgängliga.",
      category: "PRODUCT_INFORMATION",
      priority: "HIGH",
    },
    {
      title: "Uppdaterad arbetstidspolicy",
      content:
        "Arbetstidspolicyn har uppdaterats från och med 1 april. Läs igenom den nya versionen i intranätet.",
      category: "NEWS",
      priority: "LOW",
    },
    {
      title: "Sommarkampanj planering startad",
      content:
        "Planeringen för sommarkampanjen 2026 är igång. Första materialleverans sker vecka 20.",
      category: "CAMPAIGN",
      priority: "HIGH",
    },
    {
      title: "Ny kassahantering i butikerna",
      content:
        "En uppdaterad kassaprocess införs stegvis under april. Se manual för detaljer.",
      category: "STORE_MANUAL",
      priority: "MEDIUM",
    },
    {
      title: "Produktinformation: Ny dryckesserie",
      content:
        "En ny ekologisk dryckesserie lanseras i sortimentet från och med nästa vecka.",
      category: "PRODUCT_INFORMATION",
      priority: "MEDIUM",
    },
    {
      title: "Intern uppdatering: HR-policy",
      content:
        "HR har uppdaterat riktlinjer kring ledighet och frånvaro. Kontrollera dokumentationen.",
      category: "NEWS",
      priority: "LOW",
    },
    {
      title: "Black Week förberedelser",
      content:
        "Förberedelser inför Black Week 2026 startar i maj. Kampanjmaterial skickas ut snart.",
      category: "CAMPAIGN",
      priority: "URGENT",
    },
    {
      title: "Ny utbildning för butikspersonal",
      content:
        "En ny digital utbildning för kundbemötande lanseras i systemet denna månad.",
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
