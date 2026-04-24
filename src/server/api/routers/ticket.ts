import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { createAuditLog } from "~/server/api/services/auditLogService";
import { prismaEventService } from "../services/eventService";
import { TRPCError } from "@trpc/server";
import { ParentType, Department, Priority, Status } from "@prisma/client";

export const ticketRouter = createTRPCRouter({
  listAllTickets: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(20),
        cursor: z.string().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const tickets = await ctx.db.ticket.findMany({
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: { createdAt: "desc" },
        include: {
          createdBy: true,
          assignedTo: true,
          thread: { select: { id: true } },
        },
      });

      let nextCursor: string | null = null;
      if (tickets.length > input.limit) {
        const nextItem = tickets.pop()!;
        nextCursor = nextItem.id;
      }

      return { tickets, nextCursor };
    }),

  listUserTickets: protectedProcedure.query(({ ctx }) => {
    return ctx.db.ticket.findMany({
      where: { createdById: ctx.session.user.id },
      include: {
        createdBy: true,
        assignedTo: true,
        thread: { select: { id: true } },
      },
    });
  }),

  getTicketById: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      const ticket = await ctx.db.ticket.findUnique({
        where: { id: input.id },
        include: {
          createdBy: true,
          assignedTo: true,
          thread: { select: { id: true } },
        },
      });

      return ticket;
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        issue: z.string().min(1),
        department: z.nativeEnum(Department),
        isAnonymous: z.boolean().optional(),
        priority: z.nativeEnum(Priority).optional(),
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
          thread: {
            create: {
              type: ParentType.TICKET,
            },
          },
        },
        include: {
          thread: true,
        },
      });

      await prismaEventService.createEvent({
        type: "TICKET_CREATED",
        originId: ticket.id,
        originType: "TICKET",
        actorId: ctx.session.user.id,
      });

      await createAuditLog({
        type: "TICKET_CREATED",
        severity: "INFO",
        entityType: "TICKET",
        entityId: ticket.id,
        actor: { connect: { id: ctx.session.user.id } },
        message: `${ctx.session.user.email} created ticket "${ticket.title}"`,
      });

      return ticket;
    }),

  updateTicket: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.nativeEnum(Status).optional(),
        priority: z.nativeEnum(Priority).optional(),
        assignedToId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const ticket = await ctx.db.ticket.findUnique({
        where: { id: input.id },
      });

      if (!ticket) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Ticket hittades inte",
        });
      }

      const updatedTicket = await ctx.db.ticket.update({
        where: { id: input.id },
        data: {
          status: input.status,
          priority: input.priority,
          assignedToId: input.assignedToId,
        },
      });

      if (input.status && input.status !== ticket.status) {
        await prismaEventService.createEvent({
          type: "TICKET_STATUS_CHANGED",
          originId: ticket.id,
          originType: "TICKET",
          actorId: ctx.session.user.id,
          metadata: {
            oldStatus: ticket.status,
            newStatus: input.status,
          },
        });

        await createAuditLog({
          type: "TICKET_STATUS_CHANGED",
          severity: "INFO",
          entityType: "TICKET",
          entityId: ticket.id,
          actor: { connect: { id: ctx.session.user.id } },
          message: `${ctx.session.user.email} changed status from ${ticket.status} to ${input.status}`,
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

        await createAuditLog({
          type: "TICKET_CHANGED_PRIORITY",
          severity: "WARNING",
          entityType: "TICKET",
          entityId: ticket.id,
          actor: { connect: { id: ctx.session.user.id } },
          message: `${ctx.session.user.email} changed priority from ${ticket.priority} to ${input.priority}`,
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

        await createAuditLog({
          type: "TICKET_ASSIGNED",
          severity: "INFO",
          entityType: "TICKET",
          entityId: ticket.id,
          actor: { connect: { id: ctx.session.user.id } },
          message: `Ticket assigned to ${input.assignedToId}`,
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

      await createAuditLog({
        type: "TICKET_USER_INVITED",
        severity: "INFO",
        entityType: "TICKET",
        entityId: input.ticketId,
        actor: { connect: { id: ctx.session.user.id } },
        message: `${ctx.session.user.email} invited user ${input.userId} to ticket`,
      });

      return updatedTicket;
    }),
});
