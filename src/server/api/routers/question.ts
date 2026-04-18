import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { prismaEventService } from "../services/eventService";
import { createAuditLog } from "~/server/api/services/auditLogService";
import { TRPCError } from "@trpc/server";
import { ParentType } from "@prisma/client";

export const questionRouter = createTRPCRouter({
  listQuestions: protectedProcedure
    .input(
      z.object({
        limit: z.number().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const questions = await ctx.db.question.findMany({
        take: input?.limit ?? 5,
        include: {
          createdBy: {
            select: { id: true, name: true },
          },
          thread: {
            include: {
              messages: {},
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return questions;
    }),

  createQuestion: protectedProcedure
    .input(
      z.object({
        question: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const question = await ctx.db.question.create({
        data: {
          question: input.question,
          createdById: ctx.session.user.id,
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
      //   await prismaEventService.createEvent({
      //     type: "NEWS_CREATED",
      //     originId: news.newsId,
      //     originType: "NEWS",
      //     actorId: ctx.session.user.id,
      //   });

      //   await createAuditLog({
      //     type: "NEWS_CREATED",
      //     severity: "INFO",
      //     entityType: "NEWS",
      //     entityId: news.newsId,
      //     actor: { connect: { id: ctx.session.user.id } },
      //     message: `${ctx.session.user.email} created ticket "${news.title}"`,
      //   });

      return question;
    }),
  // addMessage: protectedProcedure
  //   .input(
  //     z.object({
  //       id: z.string(),
  //       message: z.string().min(1),
  //     }),
  //   )
  //   .mutation(async ({ ctx, input }) => {
  //     const question = await ctx.db.question.findUnique({
  //       where: { id: input.id },
  //       include: { thread: true },
  //     });

  //     return ctx.db.message.create({
  //       data: {
  //         message: input.message,
  //         threadId: question?.thread?.threadId,
  //         createdById: ctx.session.user.id,
  //       },
  //       include: {
  //         createdBy: true,
  //       },
  //     });
  //   }),
  //   updateQuestion: protectedProcedure
  //     .input(
  //       z.object({
  //         newsId: z.string(),
  //         title: z.string().optional(),
  //         category: z
  //           .enum(["NEWS", "STORE_MANUAL", "PRODUCT_INFORMATION", "CAMPAIGN"])
  //           .optional(),
  //         content: z.string().optional(),
  //         priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  //       }),
  //     )
  //     .mutation(async ({ ctx, input }) => {
  //       const news = await ctx.db.news.findUnique({
  //         where: { newsId: input.newsId },
  //       });

  //       if (!news) {
  //         throw new TRPCError({
  //           code: "NOT_FOUND",
  //           message: "News hittades inte",
  //         });
  //       }

  //       const updatedNews = await ctx.db.news.update({
  //         where: { newsId: input.newsId },
  //         data: {
  //           title: input.title,
  //           category: input.category,
  //           content: input.content,
  //         },
  //       });

  //       if (input.priority && input.priority !== news.priority) {
  //         await prismaEventService.createEvent({
  //           type: "NEWS_CHANGED",
  //           originId: news.newsId,
  //           originType: "NEWS",
  //           actorId: ctx.session.user.id,
  //           metadata: {
  //             oldPriority: news.priority,
  //             newPriority: input.priority,
  //           },
  //         });

  //         await createAuditLog({
  //           type: "NEWS_CHANGED_PRIORITY",
  //           severity: "WARNING",
  //           entityType: "NEWS",
  //           entityId: news.newsId,
  //           actor: { connect: { id: ctx.session.user.id } },
  //           message: `Priority changed from ${news.priority} to ${input.priority}`,
  //         });
  //       }

  //       return updatedNews;
  //     }),
});
