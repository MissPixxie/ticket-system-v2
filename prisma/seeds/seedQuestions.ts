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
    },
    {
      question:
        "Vid vissa tider på dagen blir kassasystemet väldigt segt. Är detta känt?",
    },
    {
      question:
        "Finns det någon vy där jag kan se alla tidigare tickets jag har skapat?",
    },
    {
      question:
        "Jag blir utloggad varje gång jag stänger appen. Är detta en bugg?",
    },
    {
      question: "Vad är skillnaden mellan ADMIN, HANDLER och USER i praktiken?",
    },
    {
      question: "Jag vill få push-notiser när nya kampanjer publiceras.",
    },
    {
      question: "Finns det en standardprocess för bug reports?",
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
