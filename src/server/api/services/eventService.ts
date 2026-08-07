import { EventEmitter } from "events";
import { EventOrigin, EventType, Severity } from "@prisma/client";
import { db } from "~/server/db";
import { createAuditLog } from "./auditLogService";
import { resolveRecipients } from "./recipientResolver";

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

    const originExists =
      originType === "TICKET"
        ? await db.ticket.findUnique({ where: { id: originId } })
        : originType === "QUESTION"
          ? await db.question.findUnique({ where: { id: originId } })
          : originType === "SUGGESTION"
            ? await db.suggestion.findUnique({ where: { id: originId } })
            : await db.message.findUnique({ where: { id: originId } });

    if (!originExists) {
      throw new Error(`${originType} med id ${originId} finns inte`);
    }

    const meta: EventMetadata = {
      ...metadata,
      timestamp: new Date().toISOString(),
    };

    console.log("🚨 EVENT METADATA", JSON.stringify(meta, null, 2));

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

    console.log("Skapar notification", {
      actorId,
      eventId: event.id,
      recipients,
    });

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
