import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const eventRouter = createTRPCRouter({
  createEvent: protectedProcedure
    .input(
      z.object({
        type: z.enum([
          "TICKET_CREATED",
          "TICKET_STATUS_CHANGED",
          "TICKET_ASSIGNED",
          "TICKET_CHANGED_PRIORITY",
          "MESSAGE_ADDED",
          "SUGGESTION_CREATED",
          "SUGGESTION_STATUS_CHANGED",
        ]),
        originId: z.string().min(1),
        originType: z.enum(["TICKET", "SUGGESTION"]),
        metadata: z.record(z.string()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const originExists =
        input.originType === "TICKET"
          ? await ctx.db.ticket.findUnique({ where: { id: input.originId } })
          : await ctx.db.suggestion.findUnique({
              where: { id: input.originId },
            });

      if (!originExists) {
        throw new Error(
          `${input.originType} with id ${input.originId} does not exist`,
        );
      }

      const meta = {
        ...input.metadata,
        oldStatus: (originExists as any).status,
        timestamp: new Date().toISOString(),
      };

      const event = await ctx.db.event.create({
        data: {
          type: input.type,
          originId: input.originId,
          originType: input.originType,
          actorId: ctx.session.user.id,
          metadata: meta,
        },
      });

      const subscriptions = await ctx.db.subscription.findMany({
        where: {
          originId: input.originId,
          type: input.originType === "TICKET" ? "TICKET" : "SUGGESTION",
        },
      });

      await ctx.db.notification.createMany({
        data: subscriptions.map((sub) => ({
          userId: sub.userId,
          eventId: event.id,
        })),
      });

      return event;
    }),

  getByOrigin: protectedProcedure
    .input(
      z.object({
        originId: z.string().min(1),
        originType: z.enum(["TICKET", "SUGGESTION"]),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.event.findMany({
        where: {
          originId: input.originId,
          originType: input.originType,
        },
        include: {
          actor: true,
          notifications: true,
        },
        orderBy: { createdAt: "desc" },
      });
    }),
});
