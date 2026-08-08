import { EventEmitter } from "events";
import { EventOrigin, EventType, Severity } from "@prisma/client";
import { db } from "~/server/db";
import { createAuditLog } from "./auditLogService";
import { resolveRecipients } from "./recipientResolver";
import { resolveNotificationPath } from "./notificationPathResolver";

type EventMetadata = Record<string, any>;

export class PrismaEventService extends EventEmitter {
  async createEvent(params: {
    type: EventType;
    originId: string;
    originType: EventOrigin;
    actorId: string;
    severity?: Severity;
    metadata?: EventMetadata;
  }) {
    const { type, originId, originType, actorId, metadata } = params;

    let originExists;

    switch (originType) {
      case "TICKET":
        originExists = await db.ticket.findUnique({
          where: { id: originId },
        });
        break;

      case "QUESTION":
        originExists = await db.question.findUnique({
          where: { id: originId },
        });
        break;

      case "SUGGESTION":
        originExists = await db.suggestion.findUnique({
          where: { id: originId },
        });
        break;

      case "NEWS":
        originExists = await db.news.findUnique({
          where: { id: originId },
        });
        break;

      case "RESOURCE":
        originExists = await db.resource.findUnique({
          where: { id: originId },
        });
        break;

      default:
        throw new Error(`Okänd originType: ${originType}`);
    }

    if (!originExists) {
      throw new Error(`${originType} med id ${originId} finns inte`);
    }

    const path = await resolveNotificationPath(originType, originId);

    const meta = {
      ...metadata,
      path,
      timestamp: new Date().toISOString(),
    };

    const event = await db.event.create({
      data: {
        type,
        originId,
        originType,
        actorId,
        metadata: meta,
      },
    });

    const recipients = await resolveRecipients({
      type,
      originType,
      originId,
      actorId,
    });

    if (recipients.length > 0) {
      await db.notification.createMany({
        data: recipients.map((userId) => ({
          userId,
          eventId: event.id,
        })),
      });
    }

    // const subscriptions = await db.subscription.findMany({
    //   where: {
    //     originId,
    //     type: originType,
    //   },
    // });

    // await db.notification.createMany({
    //   data: subscriptions.map((sub) => ({
    //     userId: sub.userId,
    //     eventId: event.id,
    //   })),
    // });

    // this.emit(`${originType.toLowerCase()}:${type.toLowerCase()}`, {
    //   event,
    //   subscriptions,
    // });

    // if (params.severity) {
    //   await createAuditLog({
    //     type: params.type,
    //     severity: params.severity,
    //     entityType: params.originType,
    //     entityId: params.originId,
    //     actor: { connect: { id: params.actorId } },
    //     message: "",
    //   });
    // }

    return event;
  }
}

export const prismaEventService = new PrismaEventService();
