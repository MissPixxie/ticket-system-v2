import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { createAuditLog } from "~/server/api/services/auditLogService";
import { prismaEventService } from "../services/eventService";
import { TRPCError } from "@trpc/server";
import { SuggestionStatus } from "@prisma/client";

export const suggestionBoxRouter = createTRPCRouter({
  listSuggestions: protectedProcedure.query(async ({ ctx }) => {
    const suggestionBox = await ctx.db.suggestionBox.findFirstOrThrow();
    const userId = ctx.session.user.id;

    const suggestions = await ctx.db.suggestion.findMany({
      where: { suggestionBoxId: suggestionBox.id },
      include: { user: true },
      orderBy: [{ voteCount: "desc" }, { createdAt: "desc" }],
    });

    const userVotes = await ctx.db.vote.findMany({
      where: {
        userId,
        suggestionId: {
          in: suggestions.map((s) => s.id),
        },
      },
      select: {
        suggestionId: true,
      },
    });

    const votedSet = new Set(userVotes.map((v) => v.suggestionId));

    return suggestions.map((s) => ({
      ...s,
      hasVoted: votedSet.has(s.id),
      user: s.isAnonymous ? { name: "Anonym" } : s.user,
    }));
  }),

  findSuggestion: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const suggestion = await ctx.db.suggestion.findUnique({
        where: { id: input.id },
        include: {
          user: true,
        },
      });
      if (!suggestion) throw new TRPCError({ code: "NOT_FOUND" });
      return suggestion;
    }),

  createSuggestion: protectedProcedure
    .input(
      z.object({
        content: z.string().min(1),
        isAnonymous: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const suggestionBox = await ctx.db.suggestionBox.findFirstOrThrow();
      const suggestion = await ctx.db.suggestion.create({
        data: {
          content: input.content,
          suggestionBoxId: suggestionBox.id,
          userId: ctx.session.user.id,
          isAnonymous: input.isAnonymous ?? false,
        },
      });

      await prismaEventService.createEvent({
        type: "SUGGESTION_CREATED",
        originId: suggestion.id,
        originType: "SUGGESTION",
        actorId: ctx.session.user.id,
        metadata: { suggestionBoxId: suggestionBox.id },
      });

      await createAuditLog({
        type: "SUGGESTION_CREATED",
        severity: "INFO",
        entityType: "SUGGESTION",
        entityId: suggestion.id,
        actor: { connect: { id: ctx.session.user.id } },
        message: `${ctx.session.user.email} created a suggestion`,
      });

      return suggestion;
    }),

  updateSuggestionStatus: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        status: z.nativeEnum(SuggestionStatus),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const suggestion = await ctx.db.suggestion.findUnique({
        where: { id: input.id },
      });

      if (!suggestion) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Suggestion hittades inte",
        });
      }

      const updated = await ctx.db.suggestion.update({
        where: { id: input.id },
        data: {
          status: input.status,
        },
      });

      // await prismaEventService.createEvent({
      //   type: "SUGGESTION_STATUS_CHANGED",
      //   originId: input.id,
      //   originType: "SUGGESTION",
      //   actorId: ctx.session.user.id,
      //   metadata: {
      //     oldStatus: suggestion.status,
      //     newStatus: input.status,
      //   },
      // });

      // await createAuditLog({
      //   type: "SUGGESTION_STATUS_CHANGED",
      //   severity: "INFO",
      //   entityType: "SUGGESTION",
      //   entityId: input.id,
      //   actor: { connect: { id: ctx.session.user.id } },
      //   message: `Status changed from ${suggestion.status} to ${input.status}`,
      // });

      return updated;
    }),

  voteSuggestion: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        vote: z.enum(["UP"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const suggestion = await ctx.db.suggestion.findUnique({
        where: { id: input.id },
        select: { userId: true },
      });

      if (!suggestion) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      // ❌ block own vote
      if (suggestion.userId === userId) {
        return { voted: false, reason: "own suggestion" };
      }

      const existingVote = await ctx.db.vote.findUnique({
        where: {
          userId_suggestionId: {
            userId,
            suggestionId: input.id,
          },
        },
      });

      // =========================
      // UNVOTE
      // =========================
      if (existingVote) {
        await ctx.db.$transaction(async (tx) => {
          await tx.vote.delete({
            where: { id: existingVote.id },
          });

          await tx.suggestion.update({
            where: { id: input.id },
            data: {
              voteCount: { decrement: 1 },
            },
          });
        });

        return { removed: true };
      }

      // =========================
      // VOTE
      // =========================
      await ctx.db.$transaction(async (tx) => {
        await tx.vote.create({
          data: {
            type: input.vote,
            suggestionId: input.id,
            userId,
          },
        });

        await tx.suggestion.update({
          where: { id: input.id },
          data: {
            voteCount: { increment: 1 },
          },
        });
      });

      await prismaEventService.createEvent({
        type: "SUGGESTION_VOTED",
        originId: input.id,
        originType: "SUGGESTION",
        actorId: userId,
        metadata: { voteType: input.vote },
      });

      return { voted: true };
    }),
});
