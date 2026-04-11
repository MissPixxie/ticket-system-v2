import { db } from "~/server/db";

export async function seedSuggestions() {
  const existing = await db.suggestion.findFirst();

  if (existing) return;

  // Hämta suggestionBox (krävs i din modell)
  const box = await db.suggestionBox.findFirst();
  if (!box)
    throw new Error("SuggestionBox must exist before seeding suggestions");

  await db.suggestion.createMany({
    data: [
      {
        id: "s1",
        content: "Kan vi få bättre skyltning för kampanjer i butikerna?",
        status: "SENT",
        isAnonymous: false,
        userId: null, // kan sättas om du vill koppla users senare
        suggestionBoxId: box.id,
        voteCount: 12,
      },
      {
        id: "s2",
        content: "Önskar kortare laddningstid i kassasystemet",
        status: "UNDER_REVIEW",
        isAnonymous: false,
        userId: null,
        suggestionBoxId: box.id,
        voteCount: 28,
      },
      {
        id: "s3",
        content: "Mer utbildning kring nya produkter i personalportalen",
        status: "APPROVED",
        isAnonymous: true,
        userId: null,
        suggestionBoxId: box.id,
        voteCount: 19,
      },
      {
        id: "s4",
        content: "Kan vi få mörkt läge i systemet?",
        status: "SENT",
        isAnonymous: false,
        userId: null,
        suggestionBoxId: box.id,
        voteCount: 45,
      },
      {
        id: "s5",
        content: "Bättre filter för nyheter och kampanjer behövs",
        status: "UNDER_REVIEW",
        isAnonymous: true,
        userId: null,
        suggestionBoxId: box.id,
        voteCount: 33,
      },
      {
        id: "s6",
        content: "Appen kraschar ibland när man öppnar tickets",
        status: "SENT",
        isAnonymous: false,
        userId: null,
        suggestionBoxId: box.id,
        voteCount: 7,
      },
      {
        id: "s7",
        content: "Kan vi få push-notiser vid nya kampanjer?",
        status: "APPROVED",
        isAnonymous: false,
        userId: null,
        suggestionBoxId: box.id,
        voteCount: 51,
      },
      {
        id: "s8",
        content: "Förbättra sökfunktionen i dashboarden",
        status: "IMPLEMENTED",
        isAnonymous: true,
        userId: null,
        suggestionBoxId: box.id,
        voteCount: 63,
      },
    ],
  });

  console.log("💡 Seeded suggestions");
}
