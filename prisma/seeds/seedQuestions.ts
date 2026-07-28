import { db } from "~/server/db";

export async function seedQuestions() {
  const existing = await db.question.findFirst();

  if (existing) return;

  const questions = [
    {
      id: "q1",
      question:
        "Jag är registrerad på fel avdelning och behöver uppdatera detta. Var gör jag det?",
    },
    {
      id: "q2",
      question:
        "Jag kan inte hitta senaste kampanjmaterialet för våren 2026 i systemet.",
    },
    {
      id: "q3",
      question:
        "Vid vissa tider på dagen blir kassasystemet väldigt segt. Är detta känt?",
    },
    {
      id: "q4",
      question:
        "Finns det någon vy där jag kan se alla tidigare tickets jag har skapat?",
    },
    {
      id: "q5",
      question:
        "Jag blir utloggad varje gång jag stänger appen. Är detta en bugg?",
    },
    {
      id: "q6",
      question: "Vad är skillnaden mellan ADMIN, HANDLER och USER i praktiken?",
    },
    {
      id: "q7",
      question: "Jag vill få push-notiser när nya kampanjer publiceras.",
    },
    {
      id: "q8",
      question: "Finns det en standardprocess för bug reports?",
    },
  ];

  for (const q of questions) {
    const conversation = await db.conversation.create({
      data: {},
    });

    await db.question.create({
      data: {
        id: q.id,
        question: q.question,
        createdById: null,
        conversationId: conversation.id,
      },
    });
  }

  console.log("❓ Seeded questions");
}
