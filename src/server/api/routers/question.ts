import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { prismaEventService } from "../services/eventService";
import { createAuditLog } from "~/server/api/services/auditLogService";
import { TRPCError } from "@trpc/server";

export const questionRouter = createTRPCRouter({
  listQuestions: protectedProcedure
    .input(z.object({ questionId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      return ctx.db.question.findMany({
        where: { questionId: input.questionId },
        include: { createdBy: true },
        orderBy: { createdAt: "asc" },
      });
    }),

  createQuestion: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        content: z.string().min(1),
        category: z.enum(["GENERAL", "TECHNICAL", "ACCOUNT", "OTHER"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const question = await ctx.db.question.create({
        data: {
          title: input.title,
          content: input.content,
          category: input.category,
          createdById: ctx.session.user.id,
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
