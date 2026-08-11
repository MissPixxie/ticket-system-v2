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
      "Samlad dokumentation för butikens dagliga rutiner och arbetssätt. Manualen innehåller information om bland annat öppning och stängning av butik, kassahantering, varuplock, kundbemötande, ordinarie arbetsuppgifter och rutiner som ska följas under en vanlig arbetsdag.",
    url: "https://intranat.example.com/butiksmanual",
    category: "DOCUMENTATION",
  },

  {
    title: "Royal Canin Produktguide",
    description:
      "Produktguide med information om Royal Canins hund- och kattfoder, olika produktserier och deras användningsområden. Guiden innehåller även rekommendationer kring val av foder samt svar på vanliga frågor som kunder kan ha om produkterna.",
    url: "https://intranat.example.com/produktguide",
    category: "INFORMATION",
  },

  {
    title: "Problem med butikens skrivare",
    description:
      "Felsökningsguide för problem med skrivare och etikettskrivare i butik. Kontrollera först att skrivaren är ansluten och syns på datorn. Kontrollera därefter att rätt skrivare är vald som standardskrivare och att inga utskrifter har fastnat i utskriftskön. Om skrivaren fortfarande inte fungerar kan den behöva startas om eller anslutningen kontrolleras på nytt. Kontrollera även om problemet gäller en specifik dator eller om samma problem uppstår från andra datorer.",
    url: "https://intranat.example.com/tutorials/skrivare",
    category: "TUTORIAL",
  },

  {
    title: "Felsökning av program på butikens datorer",
    description:
      "Guide för problem där ett program som används i butiken inte går att starta eller fungerar som förväntat. Kontrollera först om problemet bara gäller en dator eller om flera datorer påverkas. Kontrollera eventuella felmeddelanden, starta om programmet och vid behov datorn. Om programmet fortfarande inte fungerar bör det kontrolleras om en uppdatering nyligen installerats eller om programmet behöver uppdateras. Dokumentera gärna vilket program det gäller och exakt vad som händer när det försöker startas.",
    url: "https://intranat.example.com/tutorials/butiksprogram",
    category: "TUTORIAL",
  },

  {
    title: "Felsökning av inloggningsproblem",
    description:
      "Guide för problem där en användare inte kan logga in i ett internt system trots att användaren uppger att rätt lösenord används. Kontrollera först om problemet gäller endast den aktuella användaren eller om flera användare påverkas. Dokumentera eventuella felmeddelanden som visas vid inloggning och kontrollera om användaren fortfarande kan logga in i andra system. Om andra användare kan logga in kan problemet vara kopplat till det specifika användarkontot snarare än systemet som helhet.",
    url: "https://intranat.example.com/tutorials/inloggning",
    category: "TUTORIAL",
  },

  {
    title: "Felsökning av lagersaldo",
    description:
      "Guide för situationer där lagersaldot i butikssystemet inte stämmer överens med det faktiska antalet produkter i butiken. Kontrollera först det fysiska lagersaldot och jämför det med informationen i Sitoo och Business Central. Om flera system visar olika antal kan problemet bero på att lagersaldot inte har synkats korrekt. Dokumentera vilken produkt det gäller, vilket antal som finns fysiskt och vilket antal som visas i respektive system för att underlätta felsökningen.",
    url: "https://intranat.example.com/tutorials/lagersaldo",
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
