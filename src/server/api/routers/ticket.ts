import { z } from "zod";
import { observable } from "@trpc/server/observable";
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
        ticketHistories: true,
        createdBy: true,
        assignedTo: true,
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
      const ticket = await ctx.db.ticket.create({
        data: {
          title: input.title,
          issue: input.issue,
          department: input.department,
          createdBy: { connect: { id: ctx.session.user.id } },
        },
      });

      return ticket;
    }),

  updateTicket: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        status: z.enum(["OPEN", "IN_PROGRESS", "CLOSED"]).optional(),
        priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
        assignedToId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const updatedTicket = await ctx.db.ticket.update({
        where: { id },
        data: {
          ...data,
          ticketHistories: {
            create: {
              actionType: input.status ? "CHANGED_STATUS" : "CHANGED_PRIORITY",
              userId: ctx.session.user.id,
            },
          },
          status: input.status,
          priority: input.priority,
          assignedToId: ctx.session.user.id,
        },
        include: {
          assignedTo: true,
        },
      });

      return updatedTicket;
    }),

  recordAction: protectedProcedure
    .input(
      z.object({
        ticketId: z.string().min(1),
        actionType: z.enum([
          "CREATED",
          "UPDATED",
          "CHANGED_STATUS",
          "CHANGED_PRIORITY",
          "ASSIGNED",
          "UNASSIGNED",
          "SENT",
          "ADDED_NOTE",
        ]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.action.create({
        data: {
          actionType: input.actionType,
          ticketId: input.ticketId,
          userId: ctx.session.user.id,
        },
      });
    }),
});
