import { ResourceCategory } from "@prisma/client";
import { createEmbedding } from "~/server/ai/createEmbedding";
import { generateTags } from "~/server/ai/generateTags";
import { db } from "~/server/db";

type SeedResource = {
  title: string;
  description: string;
  url: string;
  category: ResourceCategory;
};

export async function seedResources() {
  const resources: SeedResource[] = [
    {
      title: "Butiksmanual",
      description:
        "Samlad dokumentation med rutiner för öppning, stängning, kassahantering och dagliga arbetsuppgifter.",
      url: "https://intranat.example.com/butiksmanual",
      category: "DOCUMENTATION",
    },
    {
      title: "Royal Canin Produktguide",
      description:
        "Produktblad och rekommendationer för Royal Canins hund- och kattfoder samt vanliga kundfrågor.",
      url: "https://intranat.example.com/produktguide",
      category: "INFORMATION",
    },
    {
      title: "Introduktion till ticketsystemet",
      description:
        "En steg-för-steg-guide för hur du skapar tickets, svarar på frågor och följer upp ärenden.",
      url: "https://intranat.example.com/tutorials/ticketsystem",
      category: "TUTORIAL",
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

  for (const resource of resources) {
    const [embedding, tags] = await Promise.all([
      createEmbedding(`${resource.title}\n\n${resource.description}`),
      generateTags(`${resource.title}\n\n${resource.description}`),
    ]);

    await db.resource.create({
      data: {
        title: resource.title,
        description: resource.description,
        url: resource.url,
        category: resource.category,
        createdById: admin.id,
        embedding: JSON.stringify(embedding),

        tags: {
          connectOrCreate: tags.map((tag: string) => ({
            where: {
              name: tag,
            },
            create: {
              name: tag,
            },
          })),
        },
      },
    });
  }

  console.log("📚 Seeded resources");
}
