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
      // Kommer implementeras senare
      return [];

    case "TICKET_ASSIGNED":
    case "TICKET_STATUS_CHANGED":
    case "TICKET_CHANGED_PRIORITY":
    case "TICKET_MESSAGE_SENT":
      return ticket.createdById && ticket.createdById !== actorId
        ? [ticket.createdById]
        : [];

    default:
      return [];
  }
}
