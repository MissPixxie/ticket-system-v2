import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { prismaEventService } from "../services/eventService";
import { AuditMessageType, MessageType } from "@prisma/client";
import { ParentType, Department } from "@prisma/client";

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

  listUserMessages: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.message.findMany({
      where: {
        receivers: {
          some: {
            id: ctx.session.user.id,
          },
        },
      },
      include: {
        createdBy: true,
      },
    });
  }),

  createMessage: protectedProcedure
    .input(
      z.object({
        threadId: z.string().min(1).optional(),
        message: z.string().min(1),
        type: z.nativeEnum(AuditMessageType).optional(),
        receivers: z.string().optional(),
        receiverDepartments: z.array(z.nativeEnum(Department)).optional(),
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
      let originType: "TICKET" | "QUESTION" | "OUTGOINGMESSAGE";

      if (thread?.ticketId) {
        originId = thread.ticketId;
        originType = "TICKET";
      } else if (thread?.questionId) {
        originId = thread.questionId;
        originType = "QUESTION";
      } else {
        originId = thread.id;
        originType = "OUTGOINGMESSAGE";
      }

      if (input.receiverDepartments) {
        const users = await ctx.db.user.findMany({
          where: {
            departments: {
              some: {
                department: {
                  in: input.receiverDepartments,
                },
              },
            },
          },
          select: { id: true },
        });

        const newMessage = await ctx.db.message.create({
          data: {
            threadId: input.threadId,
            message: input.message,
            createdById: ctx.session.user.id,
            type: input.type ?? "USER_MESSAGE",
            receivers: {
              connect: users.map((user) => ({ id: user.id })),
            },
          },
          include: {
            createdBy: true,
          },
        });

        return newMessage;
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

  createThread: protectedProcedure
    .input(
      z.object({
        type: z.nativeEnum(ParentType),
        message: z.string().min(1),
        receivers: z.array(z.string()).optional(),
        receiverDepartments: z.array(z.nativeEnum(Department)).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const newThread = await ctx.db.thread.create({
        data: {
          type: input.type,
        },
      });

      if (input.receiverDepartments) {
        const users = await ctx.db.user.findMany({
          where: {
            departments: {
              some: {
                department: {
                  in: input.receiverDepartments,
                },
              },
            },
          },
          select: { id: true },
        });

        const newMessage = await ctx.db.message.create({
          data: {
            threadId: newThread.id,
            message: input.message,
            createdById: ctx.session.user.id,
            receivers: {
              connect: users.map((user) => ({ id: user.id })),
            },
          },
          include: {
            createdBy: true,
          },
        });

        return newMessage;
      }

      if (input.receivers) {
        const newMessage = await ctx.db.message.create({
          data: {
            threadId: newThread.id,
            message: input.message,
            createdById: ctx.session.user.id,
            receivers: {
              connect: input.receivers.map((user) => ({ id: user })),
            },
          },
          include: {
            createdBy: true,
          },
        });

        return newMessage;
      }
    }),

  createOutgoingMessage: protectedProcedure
    .input(
      z.object({
        threadId: z.string().min(1).optional(),
        message: z.string().min(1),
        includedDepartments: z.array(z.nativeEnum(Department)).optional(),
        includedUsers: z.array(z.string()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      let thread = await ctx.db.thread.findUnique({
        where: { id: input.threadId },
      });

      if (!thread) {
        thread = await ctx.db.thread.create({
          data: {
            type: ParentType.GENERAL,
          },
        });

        const newMessage = await ctx.db.generalMessage.create({
          data: {
            message: input.message,
            createdById: ctx.session.user.id,
            threadId: thread.id,
            includedDepartments: {
              create:
                input.includedDepartments?.map((dept) => ({
                  department: dept,
                  userId: ctx.session.user.id,
                })) ?? [],
            },
            includedUsers: {
              connect:
                input.includedUsers?.map((userId) => ({ id: userId })) ?? [],
            },
          },
        });

        return newMessage;
      }

      const newMessage = await ctx.db.generalMessage.create({
        data: {
          message: input.message,
          createdById: ctx.session.user.id,
          threadId: thread.id,
          includedDepartments: {
            create:
              input.includedDepartments?.map((dept) => ({
                department: dept,
                userId: ctx.session.user.id,
              })) ?? [],
          },
          includedUsers: {
            connect:
              input.includedUsers?.map((userId) => ({ id: userId })) ?? [],
          },
        },
      });

      return newMessage;
    }),

    deleteMessage: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const message = await ctx.db.message.findUnique({
        where: { id: input.id },
      });
      if (!message) {
        throw new Error("Message not found");
      }

      return await ctx.db.message.delete({
        where: { id: input.id },
      });
    }),
});
