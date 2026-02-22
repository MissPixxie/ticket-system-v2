import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const notificationRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.notification.findMany({
      where: { userId: ctx.session.user.id },
      orderBy: { createdAt: "desc" },
    });
  }),

  markAsSeen: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.notification.update({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
        data: { seen: true },
      });
    }),

  markAllAsSeen: protectedProcedure.mutation(async ({ ctx }) => {
    return ctx.db.notification.updateMany({
      where: {
        userId: ctx.session.user.id,
        seen: false,
      },
      data: { seen: true },
    });
  }),

  getUnseenCount: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.notification.count({
      where: {
        userId: ctx.session.user.id,
        seen: false,
      },
    });
  }),

  create: protectedProcedure
    .input(z.object({ userId: z.string(), text: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.notification.create({
        data: {
          userId: input.userId,
          text: input.text,
        },
      });
    }),
});
