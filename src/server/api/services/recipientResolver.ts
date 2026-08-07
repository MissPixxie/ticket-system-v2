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
    case "MESSAGE":
      return resolveMessageRecipients(originId, actorId);
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
    case "TICKET_CREATED": {
      // kommer vi implementera snart
      return [];
    }

    case "TICKET_ASSIGNED":
    case "TICKET_STATUS_CHANGED":
    case "TICKET_CHANGED_PRIORITY": {
      return ticket.createdById && ticket.createdById !== actorId
        ? [ticket.createdById]
        : [];
    }

    default:
      return [];
  }
}

async function resolveMessageRecipients(messageId: string, actorId: string) {
  const message = await db.message.findUnique({
    where: {
      id: messageId,
    },
    include: {
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

  if (!message) return [];

  return message.conversation.participants
    .map((participant) => participant.userId)
    .filter((userId) => userId !== actorId);
}
