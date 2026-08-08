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
