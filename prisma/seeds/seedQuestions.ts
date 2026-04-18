import { db } from "~/server/db";
import { ParentType } from "@prisma/client";

export async function seedQuestions() {
  const existing = await db.question.findFirst();

  if (existing) return;

  const questions = await db.question.createMany({
    data: [
      {
        id: "q1",
        question:
          "Jag är registrerad på fel avdelning och behöver uppdatera detta. Var gör jag det?",
        createdById: null,
      },
      {
        id: "q2",
        question:
          "Jag kan inte hitta senaste kampanjmaterialet för våren 2026 i systemet.",
        createdById: null,
      },
      {
        id: "q3",
        question:
          "Vid vissa tider på dagen blir kassasystemet väldigt segt. Är detta känt?",
        createdById: null,
      },
      {
        id: "q4",
        question:
          "Finns det någon vy där jag kan se alla tidigare tickets jag har skapat?",
        createdById: null,
      },
      {
        id: "q5",
        question:
          "Jag blir utloggad varje gång jag stänger appen. Är detta en bugg?",
        createdById: null,
      },
      {
        id: "q6",
        question:
          "Vad är skillnaden mellan ADMIN, HANDLER och USER i praktiken?",
        createdById: null,
      },
      {
        id: "q7",
        question: "Jag vill få push-notiser när nya kampanjer publiceras.",
        createdById: null,
      },
      {
        id: "q8",
        question: "Finns det en standardprocess för bug reports?",
        createdById: null,
      },
    ],
  });

  console.log("❓ Seeded questions");

  // 🧵 IMPORTANT: create threads for all seeded questions
  const allQuestions = await db.question.findMany({
    where: {
      id: { in: ["q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8"] },
    },
  });

  await db.thread.createMany({
    data: allQuestions.map((q) => ({
      id: `thread_${q.id}`,
      type: ParentType.QUESTION,
      questionId: q.id, // ✅ korrekt koppling
    })),
  });
}
