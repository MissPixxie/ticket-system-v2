import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  ConversationRole,
  Department,
  MessageType,
  ConversationContext,
} from "@prisma/client";
import { createAuditLog } from "../services/auditLogService";
import { prismaEventService } from "../services/eventService";
import { TRPCError } from "@trpc/server";

export const messageRouter = createTRPCRouter({
  listMessages: protectedProcedure
    .input(
      z.object({
        conversationId: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.message.findMany({
        where: {
          conversationId: input.conversationId,
        },
        orderBy: {
          createdAt: "asc",
        },
        include: {
          sender: true,
        },
      });
    }),

  listUserConversations: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.conversation.findMany({
      where: {
        context: "EMAIL",
        participants: {
          some: {
            userId: ctx.session.user.id,
            hiddenAt: null,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
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
        messages: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
          include: {
            sender: true,
          },
        },
      },
    });
  }),

  getMessageById: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      const message = await ctx.db.message.findUnique({
        where: { id: input.id },
        include: {
          sender: true,
        },
      });

      return message;
    }),

  createMessage: protectedProcedure
    .input(
      z.object({
        conversationId: z.string().min(1),
        content: z.string().min(1),
        type: z.nativeEnum(MessageType).optional(),
        context: z.enum(["TICKET", "QUESTION", "RESOURCE", "NEWS", "EMAIL"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const message = await ctx.db.$transaction(async (tx) => {
        const participant = await tx.conversationParticipant.findUnique({
          where: {
            conversationId_userId: {
              conversationId: input.conversationId,
              userId: ctx.session.user.id,
            },
          },
        });

        if (!participant) {
          await tx.conversationParticipant.create({
            data: {
              conversationId: input.conversationId,
              userId: ctx.session.user.id,
            },
          });
        }

        await tx.conversationParticipant.updateMany({
          where: {
            conversationId: input.conversationId,
          },
          data: {
            hiddenAt: null,
          },
        });

        const message = await tx.message.create({
          data: {
            conversationId: input.conversationId,
            senderId: ctx.session.user.id,
            content: input.content,
            type: input.type ?? MessageType.USER_MESSAGE,
          },
          include: {
            sender: true,
          },
        });

        await tx.conversation.update({
          where: {
            id: input.conversationId,
          },
          data: {},
        });

        return message;
      });

      switch (input.context) {
        case "TICKET":
          const ticket = await ctx.db.ticket.findUniqueOrThrow({
            where: {
              conversationId: input.conversationId,
            },
            select: {
              id: true,
              title: true,
            },
          });

          await prismaEventService.createEvent({
            type: "TICKET_MESSAGE_SENT",
            originId: ticket.id,
            originType: "TICKET",
            actorId: ctx.session.user.id,
            metadata: {
              title: ticket.title,
              messagePreview: message.content.slice(0, 80),
            },
          });
          break;

        case "QUESTION":
          const question = await ctx.db.question.findUnique({
            where: {
              conversationId: input.conversationId,
            },
            select: {
              id: true,
              question: true,
            },
          });

          if (!question) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Frågan hittades inte",
            });
          }

          await prismaEventService.createEvent({
            type: "QUESTION_MESSAGE_SENT",
            originId: question.id,
            originType: "QUESTION",
            actorId: ctx.session.user.id,
            metadata: {
              title: question.question,
              messagePreview: message.content.slice(0, 80),
            },
          });

          break;

        case "NEWS": {
          const news = await ctx.db.news.findUnique({
            where: {
              conversationId: input.conversationId,
            },
            select: {
              id: true,
              title: true,
            },
          });

          if (!news) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Nyheten hittades inte",
            });
          }

          await prismaEventService.createEvent({
            type: "NEWS_MESSAGE_SENT",
            originId: news.id,
            originType: "NEWS",
            actorId: ctx.session.user.id,
            metadata: {
              title: news.title,
              messagePreview: message.content.slice(0, 80),
            },
          });

          break;
        }

        case "EMAIL":
          break;
      }

      return message;
    }),

  createConversation: protectedProcedure
    .input(
      z.object({
        message: z.string().min(1),
        receivers: z.array(z.string()).optional(),
        receiverDepartments: z.array(z.nativeEnum(Department)).optional(),
        context: z.nativeEnum(ConversationContext).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const departmentUsers = input.receiverDepartments?.length
        ? await ctx.db.user.findMany({
            where: {
              departments: {
                some: {
                  department: {
                    in: input.receiverDepartments,
                  },
                },
              },
            },
            select: {
              id: true,
            },
          })
        : [];

      const participantIds = new Set<string>();

      participantIds.add(ctx.session.user.id);

      departmentUsers.forEach((user) => participantIds.add(user.id));

      input.receivers?.forEach((id) => participantIds.add(id));

      return await ctx.db.$transaction(async (tx) => {
        const conversation = await tx.conversation.create({
          data: {
            context: input.context,
            participants: {
              create: Array.from(participantIds).map((userId) => ({
                userId,
                role:
                  userId === ctx.session.user.id
                    ? ConversationRole.ADMIN
                    : ConversationRole.MEMBER,
              })),
            },
          },
        });

        await tx.message.create({
          data: {
            conversationId: conversation.id,
            senderId: ctx.session.user.id,
            content: input.message,
            type: MessageType.USER_MESSAGE,
          },
        });

        return await tx.conversation.findUniqueOrThrow({
          where: {
            id: conversation.id,
          },
          include: {
            participants: {
              include: {
                user: true,
              },
            },
            messages: {
              include: {
                sender: true,
              },
            },
          },
        });
      });
    }),

  deleteConversation: protectedProcedure
    .input(
      z.object({
        conversationId: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.conversationParticipant.update({
        where: {
          conversationId_userId: {
            conversationId: input.conversationId,
            userId: ctx.session.user.id,
          },
        },
        data: {
          hiddenAt: new Date(),
        },
      });
    }),

  getUsersToMessage: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.user.findMany({
      select: {
        id: true,
        name: true,
        departments: {
          select: {
            department: true,
          },
        },
      },
    });
  }),

  inviteUser: protectedProcedure
    .input(
      z.object({
        conversationId: z.string(),
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existingParticipant =
        await ctx.db.conversationParticipant.findUnique({
          where: {
            conversationId_userId: {
              conversationId: input.conversationId,
              userId: input.userId,
            },
          },
        });

      if (existingParticipant) {
        throw new Error("Användaren är redan med i konversationen.");
      }

      await ctx.db.conversationParticipant.create({
        data: {
          conversationId: input.conversationId,
          userId: input.userId,
        },
      });

      const ticket = await ctx.db.ticket.findFirst({
        where: {
          conversationId: input.conversationId,
        },
      });

      if (ticket) {
        await prismaEventService.createEvent({
          type: "TICKET_PARTICIPANT_ADDED",
          originId: ticket.id,
          originType: "TICKET",
          actorId: ctx.session.user.id,
          metadata: {
            title: ticket.title,
            invitedUserId: input.userId,
          },
        });
      }

      return ctx.db.conversation.findUnique({
        where: {
          id: input.conversationId,
        },
        include: {
          participants: {
            include: {
              user: true,
            },
          },
        },
      });
    }),
});
