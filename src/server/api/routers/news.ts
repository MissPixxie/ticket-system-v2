import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { prismaEventService } from "../services/eventService";
import { createAuditLog } from "~/server/api/services/auditLogService";
import { TRPCError } from "@trpc/server";

export const newsRouter = createTRPCRouter({
  // =========================
  // LIST NEWS (OPTIMERAD)
  // =========================
  listNews: protectedProcedure
    .input(z.object({ limit: z.number().optional() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const news = await ctx.db.news.findMany({
        take: input?.limit ?? 5,
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
            },
          },
          comments: {
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
        orderBy: { createdAt: "desc" },
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

  // =========================
  // CREATE NEWS
  // =========================
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
        originId: news.id,
        originType: "NEWS",
        actorId: ctx.session.user.id,
      });

      await createAuditLog({
        type: "NEWS_CREATED",
        severity: "INFO",
        entityType: "NEWS",
        entityId: news.id,
        actor: { connect: { id: ctx.session.user.id } },
        message: `${ctx.session.user.email} created news "${news.title}"`,
      });

      return news;
    }),

  // =========================
  // UPDATE NEWS
  // =========================
  updateNews: protectedProcedure
    .input(
      z.object({
        id: z.string(),
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
        },
      });

      return updatedNews;
    }),

  // =========================
  // PUBLISH / UNPUBLISH
  // =========================
  publishNews: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        isPublished: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.news.update({
        where: { id: input.id },
        data: {
          isPublished: input.isPublished,
        },
      });
    }),

  // =========================
  // ADD COMMENT
  // =========================
  addMessage: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        content: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.newsComment.create({
        data: {
          content: input.content,
          newsId: input.id,
          userId: ctx.session.user.id,
        },
        include: {
          user: true,
        },
      });
    }),

  // =========================
  // VOTE (OPTIMERAD TOGGLE)
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
  // upVoteNews: protectedProcedure
  //   .input(
  //     z.object({
  //       id: z.string(),
  //     }),
  //   )
  //   .mutation(async ({ ctx, input }) => {
  //     const existingVote = await ctx.db.newsVote.findUnique({
  //       where: {
  //         userId_newsId: {
  //           userId: ctx.session.user.id,
  //           newsId: input.id,
  //         },
  //       },
  //     });

  //     if (existingVote) {
  //       await ctx.db.newsVote.delete({
  //         where: {
  //           id: existingVote.id,
  //         },
  //       });
  //       if (existingVote.type === "UP") {
  //         await ctx.db.news.update({
  //           where: { id: input.id },
  //           data: {
  //             upVotes: {
  //               decrement: 1,
  //             },
  //           },
  //         });
  //       } else if (existingVote.type === "DOWN") {
  //         await ctx.db.news.update({
  //           where: { id: input.id },
  //           data: {
  //             downVotes: {
  //               decrement: 1,
  //             },
  //           },
  //         });
  //       }

  //       return { removed: true };
  //     } else {
  //       await ctx.db.news.update({
  //         where: { id: input.id },
  //         data: {
  //           upVotes: {
  //             increment: 1,
  //           },
  //         },
  //       });
  //       await ctx.db.newsVote.create({
  //         data: {
  //           userId: ctx.session.user.id,
  //           newsId: input.id,
  //           type: "UP",
  //         },
  //       });
  //       return { added: true };
  //     }
  //   }),

  // downVoteNews: protectedProcedure
  //   .input(
  //     z.object({
  //       id: z.string(),
  //     }),
  //   )
  //   .mutation(async ({ ctx, input }) => {
  //     const existingVote = await ctx.db.newsVote.findUnique({
  //       where: {
  //         userId_newsId: {
  //           userId: ctx.session.user.id,
  //           newsId: input.id,
  //         },
  //       },
  //     });

  //     if (existingVote) {
  //       await ctx.db.news.update({
  //         where: { id: input.id },
  //         data: {
  //           downVotes: {
  //             decrement: 1,
  //           },
  //         },
  //       });
  //       await ctx.db.newsVote.delete({
  //         where: {
  //           id: existingVote.id,
  //         },
  //       });

  //       return { removed: true };
  //     } else {
  //       await ctx.db.news.update({
  //         where: { id: input.id },
  //         data: {
  //           downVotes: {
  //             increment: 1,
  //           },
  //         },
  //       });
  //       await ctx.db.newsVote.create({
  //         data: {
  //           userId: ctx.session.user.id,
  //           newsId: input.id,
  //           type: "DOWN",
  //         },
  //       });
  //       return { added: true };
  //     }
  //   }),
});
