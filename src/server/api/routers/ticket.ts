import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const ticketRouter = createTRPCRouter({
  listAllTickets: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.ticket.findMany({
      include: {
        messages: true,
      },
    });
  }),

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

  updateTicket: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        status: z.enum(["OPEN", "IN_PROGRESS", "CLOSED"]).optional(),
        priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.ticket.update({
        where: { id: input.id },
        data: {
          status: input.status,
          priority: input.priority,
        },
      });
    }),
});
