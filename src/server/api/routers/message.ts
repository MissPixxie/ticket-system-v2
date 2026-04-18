import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { prismaEventService } from "../services/eventService";

export const messageRouter = createTRPCRouter({
  listMessages: protectedProcedure
    .input(
      z.object({
        threadId: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.message.findMany({
        where: {
          threadId: input.threadId,
        },
        include: {
          createdBy: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      });
    }),

  createMessage: protectedProcedure
    .input(
      z.object({
        threadId: z.string().min(1),
        message: z.string().min(1),
        type: z.enum(["USER_MESSAGE", "SYSTEM_MESSAGE"]).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const thread = await ctx.db.thread.findUnique({
        where: { id: input.threadId },
      });

      if (!thread) {
        throw new Error("Thread hittades inte");
      }
      let originId: string;
      let originType: "TICKET" | "QUESTION";

      if (thread?.ticketId) {
        originId = thread.ticketId;
        originType = "TICKET";
      } else if (thread?.questionId) {
        originId = thread.questionId;
        originType = "QUESTION";
      } else {
        throw new Error("Thread saknar koppling");
      }

      const newMessage = await ctx.db.message.create({
        data: {
          threadId: input.threadId,
          message: input.message,
          createdById: ctx.session.user.id,
          type: input.type ?? "USER_MESSAGE",
        },
        include: {
          createdBy: true,
        },
      });

      await prismaEventService.createEvent({
        type: "MESSAGE_ADDED",
        originId,
        originType,
        actorId: ctx.session.user.id,
        metadata: {
          messageId: newMessage.id,
        },
      });

      return newMessage;
    }),
});
