import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { createAuditLog } from "~/server/api/services/auditLogService";
import { prismaEventService } from "../services/eventService";
import { TRPCError } from "@trpc/server";
import { Department, Priority, Status } from "@prisma/client";
import { createEmbedding } from "~/server/ai/createEmbedding";
import { messageService } from "../services/messageService";

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
          conversation: { select: { id: true } },
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
          conversation: {
            include: {
              participants: {
                include: {
                  user: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      return ticket;
    }),

  createTicket: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        issue: z.string().min(1),
        department: z.nativeEnum(Department),
        isAnonymous: z.boolean().optional(),
        priority: z.nativeEnum(Priority).optional(),
        imagePublicId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const embeddingText = `
      Title: ${input.title}

      Issue: ${input.issue}

      Department: ${input.department}

      Priority: ${input.priority}

      `;

      const embedding = await createEmbedding(embeddingText);

      const ticket = await ctx.db.ticket.create({
        data: {
          title: input.title,
          issue: input.issue,
          department: input.department,
          embedding: JSON.stringify(embedding),
          imagePublicId: input.imagePublicId,
          createdBy: {
            connect: {
              id: ctx.session.user.id,
            },
          },
          isAnonymous: input.isAnonymous ?? false,
          priority: input.priority ?? "LOW",
          conversation: {
            create: {},
          },
        },
        include: {
          conversation: true,
        },
      });

      await prismaEventService.createEvent({
        type: "TICKET_CREATED",
        originId: ticket.id,
        originType: "TICKET",
        actorId: ctx.session.user.id,
        metadata: {
          title: ticket.title,
          oldStatus: ticket.status,
          newStatus: ticket.status,
        },
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
        imagePublicId: z.string().nullable().optional(),
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
      if (
        input.assignedToId &&
        input.assignedToId === ctx.session.user.id &&
        ticket.createdById === ctx.session.user.id
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Du kan inte acceptera en ticket som du själv har skapat.",
        });
      }

      const updatedTicket = await ctx.db.ticket.update({
        where: { id: input.id },
        data: {
          status: input.status,
          priority: input.priority,
          assignedToId: input.assignedToId,
          imagePublicId: input.imagePublicId,
        },
      });

      if (input.status && input.status !== ticket.status) {
        await prismaEventService.createEvent({
          type: "TICKET_STATUS_CHANGED",
          originId: ticket.id,
          originType: "TICKET",
          actorId: ctx.session.user.id,
          metadata: {
            title: ticket.title,
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
            title: ticket.title,
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
            title: ticket.title,
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
});
