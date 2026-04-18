import { EventEmitter } from "events";
import { db } from "~/server/db";
import { createAuditLog } from "./auditLogService";
import { Severity } from "@prisma/client";

type EventMetadata = Record<string, any>;

export class PrismaEventService extends EventEmitter {
  async createEvent(params: {
    type:
      | "TICKET_CREATED"
      | "TICKET_STATUS_CHANGED"
      | "TICKET_ASSIGNED"
      | "TICKET_CHANGED_PRIORITY"
      | "MESSAGE_ADDED"
      | "SUGGESTION_CREATED"
      | "SUGGESTION_STATUS_CHANGED"
      | "SUGGESTION_VOTED"
      | "ROLE_CHANGED"
      | "NEWS_CREATED"
      | "NEWS_CHANGED"
      | "NEWS_CHANGED_PRIORITY"
      | "QUESTION_CREATED"
      | "QUESTION_STATUS_CHANGED";
    originId: string;
    originType: "TICKET" | "SUGGESTION" | "NEWS" | "QUESTION";
    actorId: string;
    severity?: "INFO" | "WARNING" | "ERROR";
    metadata?: EventMetadata;
  }) {
    const { type, originId, originType, actorId, metadata } = params;

    const originExists =
      originType === "TICKET"
        ? await db.ticket.findUnique({ where: { id: originId } })
        : originType === "QUESTION"
          ? await db.question.findUnique({ where: { id: originId } })
          : await db.suggestion.findUnique({ where: { id: originId } });

    if (!originExists) {
      throw new Error(`${originType} med id ${originId} finns inte`);
    }

    const meta: EventMetadata = {
      ...metadata,
      timestamp: new Date().toISOString(),
      oldStatus: (originExists as any).status,
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

    const subscriptions = await db.subscription.findMany({
      where: {
        originId,
        type: originType,
      },
    });

    await db.notification.createMany({
      data: subscriptions.map((sub) => ({
        userId: sub.userId,
        eventId: event.id,
      })),
    });

    this.emit(`${originType.toLowerCase()}:${type.toLowerCase()}`, {
      event,
      subscriptions,
    });

    // if (params.severity) {
    //   createAuditLog({
    //     type: params.type,
    //     severity: params.severity,
    //     entityType: params.originType,
    //     entityId: params.originId,
    //     actor: { connect: { id: params.actorId } },
    //     message:
    //   });
    // }

    return event;
  }
}

export const prismaEventService = new PrismaEventService();
