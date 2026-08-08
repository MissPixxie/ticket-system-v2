import { EventOrigin, EventType } from "@prisma/client";
import { db } from "~/server/db";

export async function resolveRecipients(params: {
  type: EventType;
  originType: EventOrigin;
  originId: string;
  actorId: string;
}) {
  const { type, originType, originId, actorId } = params;

  switch (originType) {
    case "TICKET":
      return resolveTicketRecipients({
        type,
        ticketId: originId,
        actorId,
      });

    case "QUESTION":
      return resolveQuestionRecipients({
        type,
        questionId: originId,
        actorId,
      });

    case "NEWS":
      return resolveNewsRecipients({
        type,
        newsId: originId,
        actorId,
      });

    default:
      return [];
  }
}

async function resolveTicketRecipients(params: {
  type: EventType;
  ticketId: string;
  actorId: string;
}) {
  const { type, ticketId, actorId } = params;

  const ticket = await db.ticket.findUnique({
    where: {
      id: ticketId,
    },
    include: {
      createdBy: true,
      assignedTo: true,
    },
  });

  if (!ticket) return [];

  switch (type) {
    case "TICKET_CREATED":
      return [];

    case "TICKET_ASSIGNED":
    case "TICKET_STATUS_CHANGED":
    case "TICKET_CHANGED_PRIORITY":
      return ticket.createdById && ticket.createdById !== actorId
        ? [ticket.createdById]
        : [];

    case "TICKET_MESSAGE_SENT": {
      const recipients: string[] = [];

      const createdById = ticket.createdById;

      if (createdById !== null && createdById !== actorId) {
        recipients.push(createdById);
      }
      const assignedToId = ticket.assignedToId;

      if (
        assignedToId &&
        assignedToId !== actorId &&
        assignedToId !== ticket.createdById
      ) {
        recipients.push(assignedToId);
      }

      return recipients;
    }

    default:
      return [];
  }
}

async function resolveQuestionRecipients(params: {
  type: EventType;
  questionId: string;
  actorId: string;
}) {
  const { type, questionId, actorId } = params;

  const question = await db.question.findUnique({
    where: {
      id: questionId,
    },
    include: {
      createdBy: true,
      conversation: {
        include: {
          participants: {
            select: {
              userId: true,
            },
          },
        },
      },
    },
  });

  if (!question) return [];

  switch (type) {
    case "QUESTION_CREATED":
      return [];

    case "QUESTION_MESSAGE_SENT": {
      const recipients = [
        ...new Set(
          question.conversation?.participants
            .map((participant) => participant.userId)
            .filter((userId) => userId !== actorId) ?? [],
        ),
      ];

      console.log("hello");
      return recipients;
    }

    default:
      return [];
  }
}

async function resolveNewsRecipients(params: {
  type: EventType;
  newsId: string;
  actorId: string;
}) {
  const { type, newsId, actorId } = params;

  const news = await db.news.findUnique({
    where: {
      id: newsId,
    },
    include: {
      createdBy: true,
    },
  });

  if (!news) return [];

  switch (type) {
    case "NEWS_CREATED":
      return [];

    case "NEWS_MESSAGE_SENT": {
      const recipients: string[] = [];

      const createdById = news.createdById;

      if (createdById !== null && createdById !== actorId) {
        recipients.push(createdById);
      }

      return recipients;
    }

    default:
      return [];
  }
}
