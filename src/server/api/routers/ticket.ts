import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const ticketRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        issue: z.string().min(1),
        department: z.enum(["IT", "HR", "CAMPAIGN", "PRODUCT", "CUSTOMERCLUB"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.ticket.create({
        data: {
          title: input.title,
          issue: input.issue,
          department: input.department,
          createdBy: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  //   getLatest: protectedProcedure.query(async ({ ctx }) => {
  //     const post = await ctx.db.post.findFirst({
  //       orderBy: { createdAt: "desc" },
  //       where: { createdBy: { id: ctx.session.user.id } },
  //     });

  //     return post ?? null;
  //   }),
});
