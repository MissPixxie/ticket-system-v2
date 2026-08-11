import { db } from "~/server/db";
import {
  ConversationRole,
  Department,
  MessageType,
  Priority,
  Status,
} from "@prisma/client";
import { createEmbedding } from "~/server/ai/createEmbedding";
import { generateTags } from "~/server/ai/generateTags";

type SeedMessage = {
  sender: "USER" | "HANDLER";
  content: string;
};

type SeedTicket = {
  title: string;
  issue: string;
  priority: Priority;
  status: Status;
  messages: SeedMessage[];
};

export async function seedTickets() {
  const user = await db.user.findFirst({
    where: {
      role: {
        name: "USER",
      },
    },
  });

  const handler = await db.user.findFirst({
    where: {
      role: {
        name: "HANDLER",
      },
    },
  });

  if (!user) {
    throw new Error(
      "Ingen USER hittades. Skapa en användare med rollen USER först.",
    );
  }

  if (!handler) {
    throw new Error(
      "Ingen HANDLER hittades. Skapa en användare med rollen HANDLER först.",
    );
  }

  const ticketItems: SeedTicket[] = [
    {
      title: "Wolt – produkter saknas i sortimentet",
      issue:
        "Flera produkter som finns i vårt vanliga sortiment syns inte på Wolt. Produkterna finns i Sitoo men verkar inte ha synkats över.",
      priority: Priority.HIGH,
      status: Status.OPEN,
      messages: [
        {
          sender: "USER",
          content:
            "Vi saknar ungefär 20 produkter på Wolt. De finns i Sitoo men syns inte på Wolt.",
        },
        {
          sender: "HANDLER",
          content:
            "Är det framför allt nya produkter som saknas eller gäller det även äldre produkter?",
        },
        {
          sender: "USER",
          content:
            "Både och. Jag har framför allt märkt det på några nya hundgodisprodukter.",
        },
        {
          sender: "HANDLER",
          content:
            "Jag kollar om produkterna ligger korrekt i Sitoo och om synkningen mot Wolt har gått igenom.",
        },
      ],
    },

    {
      title: "Wolt – fel priser på produkter",
      issue:
        "Priserna på flera produkter på Wolt stämmer inte överens med priserna i butik. Produkterna visar fortfarande gamla priser trots att priset har ändrats.",
      priority: Priority.HIGH,
      status: Status.OPEN,
      messages: [
        {
          sender: "USER",
          content: "Vi har upptäckt att flera produkter på Wolt har fel pris.",
        },
        {
          sender: "HANDLER",
          content: "Är priserna korrekta i Sitoo men fel på Wolt?",
        },
        {
          sender: "USER",
          content: "Ja, Sitoo visar rätt pris men Wolt visar det gamla priset.",
        },
      ],
    },

    {
      title: "Wolt – nya produkter synkas inte",
      issue:
        "Nya produkter som läggs upp i sortimentet dyker inte automatiskt upp på Wolt.",
      priority: Priority.HIGH,
      status: Status.CLOSED,
      messages: [
        {
          sender: "USER",
          content: "Vi lade upp flera nya produkter men de syns inte på Wolt.",
        },
        {
          sender: "HANDLER",
          content: "Det kan vara problem med synkningen mellan Sitoo och Wolt.",
        },
        {
          sender: "HANDLER",
          content:
            "Jag har kontrollerat integrationen och triggat om synkningen.",
        },
        {
          sender: "USER",
          content: "Det löste problemet. Produkterna syns nu på Wolt.",
        },
      ],
    },

    {
      title: "Sitoo – prisändring syns inte i kassan",
      issue:
        "En produkt har fått ett nytt pris i systemet men kassan visar fortfarande det gamla priset när produkten skannas.",
      priority: Priority.HIGH,
      status: Status.IN_PROGRESS,
      messages: [
        {
          sender: "USER",
          content:
            "Vi ändrade priset på produkten i systemet men kassan visar fortfarande det gamla priset.",
        },
        {
          sender: "HANDLER",
          content: "Syns det nya priset korrekt i produktregistret?",
        },
        {
          sender: "USER",
          content:
            "Ja, produktregistret visar rätt pris. Det är bara kassan som visar fel.",
        },
      ],
    },

    {
      title: "Sitoo – felaktigt lagersaldo",
      issue:
        "En produkt finns fysiskt i butiken men visas som slut i lager i systemet.",
      priority: Priority.MEDIUM,
      status: Status.OPEN,
      messages: [
        {
          sender: "USER",
          content:
            "Vi har flera exemplar av produkten i butiken men systemet visar noll i lager.",
        },
        {
          sender: "HANDLER",
          content: "Är lagersaldot korrekt i Business Central?",
        },
        {
          sender: "USER",
          content: "Nej, Business Central visar också fel antal.",
        },
      ],
    },

    {
      title: "Business Central – ändringar synkas inte",
      issue:
        "Ändringar som görs i Business Central dyker inte upp i butikssystemet. Det verkar som att synkningen mellan systemen har slutat fungera.",
      priority: Priority.URGENT,
      status: Status.OPEN,
      messages: [
        {
          sender: "USER",
          content:
            "Vi har gjort flera ändringar i Business Central men de syns inte i butikssystemet.",
        },
        {
          sender: "HANDLER",
          content: "När gjordes den senaste lyckade synkningen?",
        },
        {
          sender: "USER",
          content:
            "Det verkar som att det fungerade igår men inte längre idag.",
        },
        {
          sender: "HANDLER",
          content:
            "Jag kontrollerar integrationsloggen och ser om några jobb har fastnat.",
        },
      ],
    },

    {
      title: "Prislista uppdateras inte i butiken",
      issue:
        "En ny prislista har publicerats men flera produkter fortsätter att använda den gamla prisinformationen i butiken.",
      priority: Priority.URGENT,
      status: Status.OPEN,
      messages: [
        {
          sender: "USER",
          content: "Den nya prislistan verkar inte ha slagit igenom i butiken.",
        },
        {
          sender: "HANDLER",
          content: "Gäller det alla produkter eller bara vissa?",
        },
        {
          sender: "USER",
          content:
            "Det verkar vara ungefär 30 produkter som fortfarande har gamla priser.",
        },
      ],
    },

    {
      title: "Butiksdator – program går inte att starta",
      issue:
        "Ett program som används dagligen i butiken går inte att starta på en av datorerna. Övriga datorer fungerar.",
      priority: Priority.MEDIUM,
      status: Status.OPEN,
      messages: [
        {
          sender: "USER",
          content: "Programmet startar inte på datorn vid kassan.",
        },
        {
          sender: "HANDLER",
          content: "Får du något felmeddelande när du försöker starta det?",
        },
        {
          sender: "USER",
          content: "Nej, det händer ingenting när jag klickar på programmet.",
        },
      ],
    },

    {
      title: "Etikettskrivare fungerar inte",
      issue:
        "Etikettskrivaren syns på datorn men inga etiketter skrivs ut när vi skickar en utskrift.",
      priority: Priority.HIGH,
      status: Status.OPEN,
      messages: [
        {
          sender: "USER",
          content: "Vi kan inte skriva ut några etiketter från datorn.",
        },
        {
          sender: "HANDLER",
          content: "Syns skrivaren som ansluten och vald som standardskrivare?",
        },
        {
          sender: "USER",
          content: "Ja, den syns som ansluten men utskriften kommer aldrig ut.",
        },
      ],
    },

    {
      title: "Användare kan inte logga in i systemet",
      issue:
        "En medarbetare kan inte logga in i ett internt system trots att lösenordet verkar vara korrekt. Andra användare kan logga in.",
      priority: Priority.HIGH,
      status: Status.OPEN,
      messages: [
        {
          sender: "USER",
          content:
            "Jag kommer inte längre in i systemet trots att mitt lösenord fungerar i andra system.",
        },
        {
          sender: "HANDLER",
          content: "Får du något specifikt felmeddelande vid inloggningen?",
        },
        {
          sender: "USER",
          content: "Det står bara att inloggningen misslyckades.",
        },
      ],
    },
  ];

  for (const item of ticketItems) {
    console.log(`🎫 Seedar ticket: ${item.title}`);

    const tags = await generateTags(`${item.title}\n\n${item.issue}`);

    const embeddingText = `
Title: ${item.title}

Department: IT

Priority: ${item.priority}

Status: ${item.status}

Issue:
${item.issue}

Conversation:
${item.messages
  .map((message) => {
    const sender = message.sender === "USER" ? "User" : "Handler";
    return `${sender}: ${message.content}`;
  })
  .join("\n")}
`;

    const embedding = await createEmbedding(embeddingText);

    const conversation = await db.conversation.create({
      data: {
        title: item.title,
        participants: {
          create: [
            {
              userId: user.id,
              role: ConversationRole.MEMBER,
            },
            {
              userId: handler.id,
              role: ConversationRole.MEMBER,
            },
          ],
        },
      },
    });

    const ticket = await db.ticket.create({
      data: {
        title: item.title,
        issue: item.issue,
        department: Department.IT,
        priority: item.priority,
        status: item.status,
        createdById: user.id,
        assignedToId: item.status === Status.OPEN ? null : handler.id,
        solvedAt: item.status === Status.CLOSED ? new Date() : null,
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

    await db.message.createMany({
      data: item.messages.map((message) => ({
        conversationId: conversation.id,
        senderId: message.sender === "USER" ? user.id : handler.id,
        content: message.content,
        type: MessageType.USER_MESSAGE,
      })),
    });

    console.log(`✅ Ticket skapad: ${ticket.id}`);
  }

  console.log("🎫 Seeded 10 IT ticket conversations");
}
