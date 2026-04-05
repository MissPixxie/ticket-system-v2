import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { createAuditLog } from "~/server/api/services/auditLogService";
import { prismaEventService } from "../services/eventService";
import { TRPCError } from "@trpc/server";
import { SuggestionStatus } from "@prisma/client";

export const suggestionBoxRouter = createTRPCRouter({
  listSuggestions: protectedProcedure
    .input(z.object({ suggestionBoxId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const suggestions = await ctx.db.suggestion.findMany({
        where: { suggestionBoxId: input.suggestionBoxId },
        include: { votes: true, user: true },
        orderBy: { createdAt: "desc" },
      });

      return suggestions.map((s) => ({
        ...s,
        hasVoted: s.votes.some((v) => v.userId === userId),
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
        suggestionBoxId: z.string().min(1),
        isAnonymous: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const suggestion = await ctx.db.suggestion.create({
        data: {
          content: input.content,
          suggestionBoxId: input.suggestionBoxId,
          userId: ctx.session.user.id,
          isAnonymous: input.isAnonymous ?? false,
        },
      });

      await prismaEventService.createEvent({
        type: "SUGGESTION_CREATED",
        originId: suggestion.id,
        originType: "SUGGESTION",
        actorId: ctx.session.user.id,
        metadata: { suggestionBoxId: input.suggestionBoxId },
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

      await prismaEventService.createEvent({
        type: "SUGGESTION_STATUS_CHANGED",
        originId: input.id,
        originType: "SUGGESTION",
        actorId: ctx.session.user.id,
        metadata: {
          oldStatus: suggestion.status,
          newStatus: input.status,
        },
      });

      await createAuditLog({
        type: "SUGGESTION_STATUS_CHANGED",
        severity: "INFO",
        entityType: "SUGGESTION",
        entityId: input.id,
        actor: { connect: { id: ctx.session.user.id } },
        message: `Status changed from ${suggestion.status} to ${input.status}`,
      });

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

      const existingVote = await ctx.db.vote.findFirst({
        where: { suggestionId: input.id, userId },
        include: {
          user: true,
        },
      });

      const suggestion = await ctx.db.suggestion.findUnique({
        where: { id: input.id },
        include: {
          user: true,
        },
      });

      if (suggestion?.user.id === ctx.session.user.id) {
        return { voted: false, reason: "own suggestion" };
      }

      if (existingVote) {
        await ctx.db.vote.delete({
          where: { id: existingVote.id },
        });

        return { removed: true };
      }

      const vote = await ctx.db.vote.create({
        data: {
          type: input.vote,
          suggestionId: input.id,
          userId,
        },
      });

      await prismaEventService.createEvent({
        type: "SUGGESTION_VOTED",
        originId: input.id,
        originType: "SUGGESTION",
        actorId: userId,
        metadata: { voteType: input.vote },
      });

      return vote;
    }),
});
