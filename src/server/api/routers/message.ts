import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { prismaEventService } from "../services/eventService";

export const messageRouter = createTRPCRouter({
  listMessages: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      return ctx.db.message.findMany({
        where: { ticketId: input.id },
        include: { createdBy: true },
        orderBy: { createdAt: "asc" },
      });
    }),

  createMessage: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        message: z.string().min(1),
        type: z.enum(["USER_MESSAGE", "SYSTEM_MESSAGE"]).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const ticket = await ctx.db.ticket.findUnique({
        where: { id: input.id },
        select: { id: true, createdById: true, assignedToId: true },
      });

      if (!ticket) throw new Error("Ticket hittades inte");

      const newMessage = await ctx.db.message.create({
        data: {
          ticketId: input.id,
          message: input.message,
          createdById: ctx.session.user.id,
          type: input.type || "USER_MESSAGE",
        },
      });

      await prismaEventService.createEvent({
        type: "MESSAGE_ADDED",
        originId: ticket.id,
        originType: "TICKET",
        actorId: ctx.session.user.id,
        metadata: { messageId: newMessage.id },
      });

      return newMessage;
    }),
});
