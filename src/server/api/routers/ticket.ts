import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { prismaEventService } from "../services/eventService";

export const ticketRouter = createTRPCRouter({
  listAllTickets: protectedProcedure.query(({ ctx }) => {
    return ctx.db.ticket.findMany({
      include: { messages: true, createdBy: true, assignedTo: true },
    });
  }),

  listMyTickets: protectedProcedure.query(({ ctx }) => {
    return ctx.db.ticket.findMany({
      where: { createdById: ctx.session.user.id },
      include: { messages: true, createdBy: true, assignedTo: true },
    });
  }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        issue: z.string().min(1),
        department: z.enum(["IT", "HR", "CAMPAIGN", "PRODUCT", "CUSTOMERCLUB"]),
        isAnonymous: z.boolean().optional(),
        priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const ticket = await ctx.db.ticket.create({
        data: {
          title: input.title,
          issue: input.issue,
          department: input.department,
          createdById: ctx.session.user.id,
          isAnonymous: input.isAnonymous ?? false,
          priority: input.priority ?? "LOW",
        },
      });

      await prismaEventService.createEvent({
        type: "TICKET_CREATED",
        originId: ticket.id,
        originType: "TICKET",
        actorId: ctx.session.user.id,
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
      const ticket = await ctx.db.ticket.findUnique({
        where: { id: input.id },
      });
      if (!ticket) throw new Error("Ticket hittades inte");

      if (ticket.assignedToId === null) {
        const updatedTicket = await ctx.db.ticket.update({
          where: { id: input.id },
          data: {
            status: input.status,
            priority: input.priority,
            assignedToId: ctx.session.user.id,
          },
          include: { assignedTo: true },
        });
      }

      const updatedTicket = await ctx.db.ticket.update({
        where: { id: input.id },
        data: {
          status: input.status,
          priority: input.priority,
        },
        include: { assignedTo: true },
      });

      if (input.status && input.status !== ticket.status) {
        await prismaEventService.createEvent({
          type: "TICKET_STATUS_CHANGED",
          originId: ticket.id,
          originType: "TICKET",
          actorId: ctx.session.user.id,
          metadata: { oldStatus: ticket.status, newStatus: input.status },
        });
      }

      if (input.priority && input.priority !== ticket.priority) {
        await prismaEventService.createEvent({
          type: "TICKET_CHANGED_PRIORITY",
          originId: ticket.id,
          originType: "TICKET",
          actorId: ctx.session.user.id,
          metadata: {
            oldPriority: ticket.priority,
            newPriority: input.priority,
          },
        });
      }

      if (input.assignedToId && input.assignedToId !== ticket.assignedToId) {
        await prismaEventService.createEvent({
          type: "TICKET_ASSIGNED",
          originId: ticket.id,
          originType: "TICKET",
          actorId: ctx.session.user.id,
          metadata: {
            oldAssignee: ticket.assignedToId,
            newAssignee: input.assignedToId,
          },
        });
      }

      return updatedTicket;
    }),

  inviteUserToTicket: protectedProcedure
    .input(z.object({ ticketId: z.string(), userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const updatedTicket = await ctx.db.ticket.update({
        where: { id: input.ticketId },
        data: { participants: { connect: { id: input.userId } } },
      });

      await ctx.db.subscription.upsert({
        where: {
          userId_type_originId: {
            userId: input.userId,
            type: "TICKET",
            originId: input.ticketId,
          },
        },
        create: {
          userId: input.userId,
          type: "TICKET",
          originId: input.ticketId,
        },
        update: {},
      });

      await prismaEventService.createEvent({
        type: "TICKET_ASSIGNED",
        originId: input.ticketId,
        originType: "TICKET",
        actorId: ctx.session.user.id,
        metadata: { addedUserId: input.userId },
      });

      return updatedTicket;
    }),
});
