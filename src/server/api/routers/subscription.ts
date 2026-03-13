import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const subscriptionRouter = createTRPCRouter({
  createSubscription: protectedProcedure
    .input(z.object({ id: z.string(), type: z.enum(["TICKET", "SUGGESTION"]) }))
    .mutation(async ({ ctx, input }) => {

      return ctx.db.subscription.upsert({
        where: {
          userId_type_originId: {
            userId: ctx.session.user.id,
            type: input.type,
            originId: input.id,
          },
        },
        create: {
          userId: ctx.session.user.id,
          type: input.type,
          originId: input.id,
        },
        update: {},
      });
    }),

  removeSubscription: protectedProcedure
    .input(z.object({ id: z.string(), type: z.enum(["TICKET", "SUGGESTION"]) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.subscription.delete({
        where: {
          userId_type_originId: {
            userId: ctx.session.user.id,
            type: input.type,
            originId: input.id,
          },
        },
      });
    }),

  listSubscriptions: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.subscription.findMany({
      where: { userId: ctx.session.user.id },
    });
  }),
});
