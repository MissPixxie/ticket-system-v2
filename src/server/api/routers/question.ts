import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { prismaEventService } from "../services/eventService";
import { createAuditLog } from "~/server/api/services/auditLogService";
import { TRPCError } from "@trpc/server";
import { ParentType } from "@prisma/client";
import { createEmbedding } from "~/server/ai/aiService";
import { cosineSimilarity } from "../../ai/embeddingSimilarity";
import { Prisma } from "@prisma/client";

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
          conversation: {
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
      const embedding = await createEmbedding(input.question);

      const question = await ctx.db.question.create({
        data: {
          question: input.question,
          embedding: JSON.stringify(embedding),
          createdBy: {
            connect: {
              id: ctx.session.user.id,
            },
          },
          conversation: {
            create: {},
          },
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

  findSimilarQuestions: protectedProcedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const embedding = await createEmbedding(input.text);

      const questions = await ctx.db.question.findMany({
        where: {
          embedding: {
            not: null,
          },
        },

        include: {
          conversation: {
            include: {
              messages: true,
            },
          },
        },
      });

      const results = questions.map((q) => {
        const oldEmbedding = JSON.parse(q.embedding!);

        return {
          ...q,

          similarity: cosineSimilarity(embedding, oldEmbedding),
        };
      });

      return results.sort((a, b) => b.similarity - a.similarity).slice(0, 5);
    }),
});
