import { createEmbedding } from "~/server/ai/createEmbedding";
import { generateTags } from "~/server/ai/generateTags";
import { db } from "~/server/db";
import { SuggestionStatus } from "@prisma/client";

type SeedSuggestion = {
  content: string;
  status: SuggestionStatus;
  isAnonymous: boolean;
  voteCount: number;
};

export async function seedSuggestions() {
  await db.vote.deleteMany();
  await db.suggestion.deleteMany();
  const box = await db.suggestionBox.findFirst();
  if (!box) {
    throw new Error("SuggestionBox must exist before seeding suggestions");
  }

  const suggestions: SeedSuggestion[] = [
    {
      content: "Kan vi få bättre skyltning för kampanjer i butikerna?",
      status: "SENT",
      isAnonymous: false,
      voteCount: 12,
    },
    {
      content: "Önskar kortare laddningstid i kassasystemet",
      status: "UNDER_REVIEW",
      isAnonymous: false,
      voteCount: 28,
    },
    {
      content: "Mer utbildning kring nya produkter i personalportalen",
      status: "APPROVED",
      isAnonymous: true,
      voteCount: 19,
    },
    {
      content: "Kan vi få mörkt läge i systemet?",
      status: "SENT",
      isAnonymous: false,
      voteCount: 45,
    },
    {
      content: "Bättre filter för nyheter och kampanjer behövs",
      status: "UNDER_REVIEW",
      isAnonymous: true,
      voteCount: 33,
    },
    {
      content: "Appen kraschar ibland när man öppnar tickets",
      status: "SENT",
      isAnonymous: false,
      voteCount: 7,
    },
    {
      content: "Kan vi få push-notiser vid nya kampanjer?",
      status: "APPROVED",
      isAnonymous: false,
      voteCount: 51,
    },
    {
      content: "Förbättra sökfunktionen i dashboarden",
      status: "IMPLEMENTED",
      isAnonymous: true,
      voteCount: 63,
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

  for (const s of suggestions) {
    const [embedding, tags] = await Promise.all([
      createEmbedding(s.content),
      generateTags(s.content),
    ]);

    await db.suggestion.create({
      data: {
        content: s.content,
        status: s.status,
        isAnonymous: s.isAnonymous,
        voteCount: s.voteCount,
        userId: admin.id,
        suggestionBoxId: box.id,
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

  console.log("❓ Seeded suggestions");
}

void seedSuggestions();
