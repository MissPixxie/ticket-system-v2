import { db } from "~/server/db";

export async function seedQuestions() {
  const existing = await db.question.findFirst();

  if (existing) return;

  await db.question.createMany({
    data: [
      {
        id: "q1",
        title: "Hur ändrar jag min avdelning i systemet?",
        content:
          "Jag är registrerad på fel avdelning och behöver uppdatera detta. Var gör jag det?",
        category: "ACCOUNT",
        status: "PENDING",
        createdById: null,
      },
      {
        id: "q2",
        title: "Var hittar jag kampanjmaterial?",
        content:
          "Jag kan inte hitta senaste kampanjmaterialet för våren 2026 i systemet.",
        category: "GENERAL",
        status: "ANSWERED",
        createdById: null,
      },
      {
        id: "q3",
        title: "Systemet laddar långsamt i kassan",
        content:
          "Vid vissa tider på dagen blir kassasystemet väldigt segt. Är detta känt?",
        category: "TECHNICAL",
        status: "PENDING",
        createdById: null,
      },
      {
        id: "q4",
        title: "Kan jag se historik på mina tickets?",
        content:
          "Finns det någon vy där jag kan se alla tidigare tickets jag har skapat?",
        category: "GENERAL",
        status: "CLOSED",
        createdById: null,
      },
      {
        id: "q5",
        title: "Problem med inloggning på mobilen",
        content:
          "Jag blir utloggad varje gång jag stänger appen. Är detta en bugg?",
        category: "TECHNICAL",
        status: "ANSWERED",
        createdById: null,
      },
      {
        id: "q6",
        title: "Hur fungerar rollsystemet?",
        content:
          "Vad är skillnaden mellan ADMIN, HANDLER och USER i praktiken?",
        category: "ACCOUNT",
        status: "PENDING",
        createdById: null,
      },
      {
        id: "q7",
        title: "Kan man få notiser för nya kampanjer?",
        content: "Jag vill få push-notiser när nya kampanjer publiceras.",
        category: "GENERAL",
        status: "ANSWERED",
        createdById: null,
      },
      {
        id: "q8",
        title: "Hur rapporterar jag ett fel i systemet?",
        content: "Finns det en standardprocess för bug reports?",
        category: "OTHER",
        status: "PENDING",
        createdById: null,
      },
    ],
  });

  console.log("❓ Seeded questions");
}
