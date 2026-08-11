import { createEmbedding } from "~/server/ai/createEmbedding";
import { generateTags } from "~/server/ai/generateTags";
import { db } from "~/server/db";

export async function seedQuestions() {
const questions = [
  {
    question:
      "Jag är registrerad på fel avdelning och behöver uppdatera detta. Var gör jag det?",
  },

  {
    question:
      "Jag kan inte hitta senaste kampanjmaterialet för våren 2026 i systemet.",
    messages: [
      {
        sender: "USER",
        content:
          "Jag hittar inte det senaste kampanjmaterialet för vårkampanjen 2026.",
      },
      {
        sender: "HANDLER",
        content:
          "Kontrollera först kampanjsektionen under resurser. Materialet kan även ligga i den gemensamma butiksmanualen.",
      },
      {
        sender: "USER",
        content: "Jag hittade det under resurser. Tack!",
      },
    ],
  },

  {
    question:
      "Vid vissa tider på dagen blir kassasystemet väldigt segt. Är detta känt?",
    messages: [
      {
        sender: "USER",
        content:
          "Kassasystemet blir väldigt segt vid vissa tider på dagen, framför allt runt lunch.",
      },
      {
        sender: "HANDLER",
        content:
          "Vi har sett liknande problem tidigare. Det kan sammanfalla med perioder då flera integrationer och synkningar körs samtidigt.",
      },
      {
        sender: "USER",
        content: "Är det något vi behöver göra när det händer?",
      },
      {
        sender: "HANDLER",
        content:
          "Notera ungefär vilken tid problemet börjar och hur länge det pågår. Det gör det lättare att jämföra med integrationsloggarna.",
      },
    ],
  },

  {
    question:
      "Finns det någon vy där jag kan se alla tidigare tickets jag har skapat?",
    messages: [
      {
        sender: "USER",
        content:
          "Finns det något sätt att se alla tickets som jag själv har skapat tidigare?",
      },
      {
        sender: "HANDLER",
        content:
          "Ja, dina egna tickets finns samlade under Mina tickets. Där kan du se både öppna och avslutade ärenden.",
      },
    ],
  },

  {
    question:
      "Jag blir utloggad varje gång jag stänger appen. Är detta en bugg?",
    messages: [
      {
        sender: "USER",
        content:
          "Varje gång jag stänger appen måste jag logga in igen när jag öppnar den.",
      },
      {
        sender: "HANDLER",
        content:
          "Det kan bero på hur sessionen sparas i webbläsaren eller om webbläsaren rensar cookies när den stängs.",
      },
      {
        sender: "USER",
        content: "Det händer bara på min dator.",
      },
      {
        sender: "HANDLER",
        content:
          "Då är det bra att kontrollera webbläsarens cookie- och sekretessinställningar först.",
      },
    ],
  },

  {
    question: "Vad är skillnaden mellan ADMIN, HANDLER och USER i praktiken?",
  },

  {
    question: "Jag vill få push-notiser när nya kampanjer publiceras.",
  },

  {
    question: "Finns det en standardprocess för bug reports?",
    messages: [
      {
        sender: "USER",
        content: "Finns det någon standard för hur vi ska rapportera buggar?",
      },
      {
        sender: "HANDLER",
        content:
          "Ja. Beskriv vad som händer, vad du förväntade dig skulle hända, när problemet uppstod och om du kan återskapa problemet. Lägg gärna till skärmdump och ange vilken dator eller vilket system som påverkas.",
      },
      {
        sender: "USER",
        content: "Bra, då vet jag vad som ska finnas med nästa gång.",
      },
    ],
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

  for (const q of questions) {
    const [embedding, tags] = await Promise.all([
      createEmbedding(q.question),
      generateTags(q.question),
    ]);

    const conversation = await db.conversation.create({
      data: {},
    });

    await db.question.create({
      data: {
        question: q.question,
        createdById: admin.id,
        conversationId: conversation.id,
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

  console.log("❓ Seeded questions");
}
