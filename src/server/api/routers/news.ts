import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { prismaEventService } from "../services/eventService";
import { createAuditLog } from "~/server/api/services/auditLogService";
import { TRPCError } from "@trpc/server";
import { NewsCategory, Priority } from "@prisma/client";

export const newsRouter = createTRPCRouter({
  // =========================
  // LIST NEWS (OPTIMERAD)
  // =========================
  listNews: protectedProcedure
    .input(z.object({ limit: z.number().optional() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const news = await ctx.db.news.findMany({
        where: {
          isPublished: true,
        },
        take: input.limit ?? 5,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
            },
          },
          conversation: {
            select: {
              id: true,
            },
          },
          tags: true,
        },
      });

      const votes = await ctx.db.newsVote.findMany({
        where: {
          userId,
          newsId: {
            in: news.map((n) => n.id),
          },
        },
        select: {
          newsId: true,
          type: true,
        },
      });

      const voteMap = new Map(votes.map((v) => [v.newsId, v.type]));

      return news.map((n) => ({
        ...n,
        hasVoted: voteMap.has(n.id),
        userVote: voteMap.get(n.id) ?? null,
      }));
    }),

  getNewsById: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const news = await ctx.db.news.findUnique({
        where: {
          id: input.id,
        },
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
            },
          },
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
              messages: {
                orderBy: {
                  createdAt: "asc",
                },
                include: {
                  sender: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                },
              },
            },
          },
          tags: true,
        },
      });

      if (!news) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Nyheten hittades inte",
        });
      }

      const vote = await ctx.db.newsVote.findUnique({
        where: {
          userId_newsId: {
            userId,
            newsId: news.id,
          },
        },
      });

      return {
        ...news,
        hasVoted: !!vote,
        userVote: vote?.type ?? null,
      };
    }),

  // =========================
  // CREATE NEWS
  // =========================
  createNews: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        content: z.string().min(1),
        category: z.nativeEnum(NewsCategory),
        priority: z.nativeEnum(Priority),
        tags: z.array(z.string()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const news = await ctx.db.news.create({
        data: {
          title: input.title,
          content: input.content,
          category: input.category,
          priority: input.priority,

          createdBy: {
            connect: {
              id: ctx.session.user.id,
            },
          },

          conversation: {
            create: {},
          },

          tags: {
            connectOrCreate:
              input.tags?.map((tag) => ({
                where: {
                  name: tag,
                },
                create: {
                  name: tag,
                },
              })) ?? [],
          },
        },
      });

      // await prismaEventService.createEvent({
      //   type: "NEWS_CREATED",
      //   originId: news.id,
      //   originType: "NEWS",
      //   actorId: ctx.session.user.id,
      // });

      // await createAuditLog({
      //   type: "NEWS_CREATED",
      //   severity: "INFO",
      //   entityType: "NEWS",
      //   entityId: news.id,
      //   actor: { connect: { id: ctx.session.user.id } },
      //   message: `${ctx.session.user.email} created news "${news.title}"`,
      // });

      return {
        ...news,
        hasVoted: false,
        userVote: null,
      };
    }),

  // =========================
  // UPDATE NEWS
  // =========================
  updateNews: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        category: z.nativeEnum(NewsCategory).optional(),
        content: z.string().optional(),
        priority: z.nativeEnum(Priority).optional(),
        isPublished: z.boolean().optional(),
        tags: z.array(z.string()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const news = await ctx.db.news.findUnique({
        where: { id: input.id },
      });

      if (!news) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "News hittades inte",
        });
      }

      const updatedNews = await ctx.db.news.update({
        where: { id: input.id },
        data: {
          title: input.title ?? undefined,
          category: input.category ?? undefined,
          content: input.content ?? undefined,
          priority: input.priority ?? undefined,
          isPublished: input.isPublished ?? undefined,
          tags: {
            set: [],
            connectOrCreate:
              input.tags?.map((tag) => ({
                where: {
                  name: tag,
                },
                create: {
                  name: tag,
                },
              })) ?? [],
          },
        },
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
            },
          },
          tags: true,
        },
      });

      return updatedNews;
    }),

  archiveNews: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        isPublished: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const news = await ctx.db.news.findUnique({
        where: { id: input.id },
      });

      if (!news) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "News hittades inte",
        });
      }

      const updatedNews = await ctx.db.news.update({
        where: { id: input.id },
        data: {
          isPublished: input.isPublished ?? undefined,
        },
      });

      return updatedNews;
    }),

  // =========================
  // VOTE
  // =========================

  voteNews: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        type: z.enum(["UP", "DOWN"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const existing = await ctx.db.newsVote.findUnique({
        where: {
          userId_newsId: {
            userId,
            newsId: input.id,
          },
        },
      });

      // =====================
      // 1. SAMMA → TA BORT
      // =====================
      if (existing && existing.type === input.type) {
        await ctx.db.newsVote.delete({
          where: { id: existing.id },
        });

        await ctx.db.news.update({
          where: { id: input.id },
          data: {
            upVotes: input.type === "UP" ? { decrement: 1 } : undefined,
            downVotes: input.type === "DOWN" ? { decrement: 1 } : undefined,
          },
        });

        return { removed: true };
      }

      // =====================
      // 2. BYT RÖST
      // =====================
      if (existing && existing.type !== input.type) {
        await ctx.db.newsVote.update({
          where: { id: existing.id },
          data: { type: input.type },
        });

        await ctx.db.news.update({
          where: { id: input.id },
          data: {
            upVotes: input.type === "UP" ? { increment: 1 } : { decrement: 1 },

            downVotes:
              input.type === "DOWN" ? { increment: 1 } : { decrement: 1 },
          },
        });

        return { switched: true };
      }

      // =====================
      // 3. NY RÖST
      // =====================
      await ctx.db.newsVote.create({
        data: {
          userId,
          newsId: input.id,
          type: input.type,
        },
      });

      await ctx.db.news.update({
        where: { id: input.id },
        data: {
          upVotes: input.type === "UP" ? { increment: 1 } : undefined,
          downVotes: input.type === "DOWN" ? { increment: 1 } : undefined,
        },
      });

      return { added: true };
    }),
});
