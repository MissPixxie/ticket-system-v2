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
      return `/questions?question=${originId}`;

    case "SUGGESTION":
      return `/suggestions/${originId}`;

    case "NEWS":
      return `/news/${originId}`;

    case "RESOURCE":
      return `/resources/${originId}`;

    default:
      return undefined;
  }
}
