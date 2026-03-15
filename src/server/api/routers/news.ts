import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { prismaEventService } from "../services/eventService";
import { createAuditLog } from "~/server/lib/audit";
import { TRPCError } from "@trpc/server";

export const newsRouter = createTRPCRouter({
  listNews: protectedProcedure
    .input(z.object({ newsId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      return ctx.db.news.findMany({
        where: { newsId: input.newsId },
        include: { createdBy: true },
        orderBy: { createdAt: "asc" },
      });
    }),

  createNews: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        content: z.string().min(1),
        category: z.enum([
          "NEWS",
          "STORE_MANUAL",
          "PRODUCT_INFORMATION",
          "CAMPAIGN",
        ]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const news = await ctx.db.news.create({
        data: {
          title: input.title,
          content: input.content,
          category: input.category,
          createdById: ctx.session.user.id,
        },
      });

      await prismaEventService.createEvent({
        type: "NEWS_CREATED",
        originId: news.newsId,
        originType: "NEWS",
        actorId: ctx.session.user.id,
      });

      await createAuditLog({
        type: "NEWS_CREATED",
        severity: "INFO",
        entityType: "NEWS",
        entityId: news.newsId,
        actor: { connect: { id: ctx.session.user.id } },
        message: `${ctx.session.user.email} created ticket "${news.title}"`,
      });

      return news;
    }),

  updateNews: protectedProcedure
    .input(
      z.object({
        newsId: z.string(),
        title: z.string().optional(),
        category: z
          .enum(["NEWS", "STORE_MANUAL", "PRODUCT_INFORMATION", "CAMPAIGN"])
          .optional(),
        content: z.string().optional(),
        priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const news = await ctx.db.news.findUnique({
        where: { newsId: input.newsId },
      });

      if (!news) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "News hittades inte",
        });
      }

      const updatedNews = await ctx.db.news.update({
        where: { newsId: input.newsId },
        data: {
          title: input.title,
          category: input.category,
          content: input.content,
        },
      });

      if (input.priority && input.priority !== news.priority) {
        await prismaEventService.createEvent({
          type: "NEWS_CHANGED",
          originId: news.newsId,
          originType: "NEWS",
          actorId: ctx.session.user.id,
          metadata: {
            oldPriority: news.priority,
            newPriority: input.priority,
          },
        });

        await createAuditLog({
          type: "NEWS_CHANGED_PRIORITY",
          severity: "WARNING",
          entityType: "NEWS",
          entityId: news.newsId,
          actor: { connect: { id: ctx.session.user.id } },
          message: `Priority changed from ${news.priority} to ${input.priority}`,
        });
      }

      return updatedNews;
    }),

  publishNews: protectedProcedure
    .input(
      z.object({
        newsId: z.string(),
        isPublished: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const news = await ctx.db.news.findUnique({
        where: { newsId: input.newsId },
      });

      if (!news) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "News hittades inte",
        });
      }

      const publishedNews = await ctx.db.news.update({
        where: { newsId: input.newsId },
        data: {
          isPublished: input.isPublished,
        },
      });

      return publishedNews;
    }),
});
