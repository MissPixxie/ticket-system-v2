import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const messageRouter = createTRPCRouter({
  listAllMessages: protectedProcedure
    .input(
      z.object({
        ticketId: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.message.findMany({
        where: { ticketId: input.ticketId },
        include: {
          createdBy: true,
        },
      });
    }),

  createMessage: protectedProcedure
    .input(
      z.object({
        ticketId: z.string().min(1),
        message: z.string().min(1),
        type: z.enum(["USER_MESSAGE", "SYSTEM_MESSAGE"]).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.message.create({
        data: {
          ticketId: input.ticketId,
          message: input.message,
          createdById: ctx.session.user.id,
          type: input.type || "USER_MESSAGE",
        },
      });
    }),
});
