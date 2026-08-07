import { EventOrigin } from "@prisma/client";
import { db } from "~/server/db";


/**
 * Bestämmer vilken sida en notifikation ska öppna.
 */


export async function resolveNotificationPath(
  originType: EventOrigin,
  originId: string,
): Promise<string | undefined> {
  switch (originType) {
    case "TICKET":
      return `/tickets/${originId}`;

    case "QUESTION":
      return `/questions/${originId}`;

    case "SUGGESTION":
      return `/suggestions/${originId}`;

    case "NEWS":
      return `/news/${originId}`;

    case "RESOURCE":
      return `/resources/${originId}`;

    case "MESSAGE": {
      const message = await db.message.findUnique({
        where: {
          id: originId,
        },
        select: {
          conversationId: true,
        },
      });

      if (!message) {
        return undefined;
      }

      // Tillhör meddelandet en ticket?
      const ticket = await db.ticket.findUnique({
        where: {
          conversationId: message.conversationId,
        },
        select: {
          id: true,
        },
      });

      if (ticket) {
        return `/tickets/${ticket.id}`;
      }

      // Tillhör meddelandet en fråga?
      const question = await db.question.findUnique({
        where: {
          conversationId: message.conversationId,
        },
        select: {
          id: true,
        },
      });

      if (question) {
        return `/questions/${question.id}`;
      }

      // Tillhör meddelandet ett förslag?
      const suggestion = await db.suggestion.findUnique({
        where: {
          conversationId: message.conversationId,
        },
        select: {
          id: true,
        },
      });

      if (suggestion) {
        return `/suggestions/${suggestion.id}`;
      }

      // Vanlig konversation
      return `/messages/${message.conversationId}`;
    }

    default:
      return undefined;
  }
}
