import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { prismaEventService } from "../services/eventService";

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

      await ctx.db.subscription.upsert({
        where: {
          userId_type_originId: {
            userId: ctx.session.user.id,
            type: "SUGGESTION",
            originId: suggestion.id,
          },
        },
        create: {
          userId: ctx.session.user.id,
          type: "SUGGESTION",
          originId: suggestion.id,
        },
        update: {},
      });

      await prismaEventService.createEvent({
        type: "SUGGESTION_CREATED",
        originId: suggestion.id,
        originType: "SUGGESTION",
        actorId: ctx.session.user.id,
        metadata: { suggestionBoxId: input.suggestionBoxId },
      });

      return suggestion;
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
      });

      if (existingVote) {
        return ctx.db.vote.delete({ where: { id: existingVote.id } });
      }

      const vote = await ctx.db.vote.create({
        data: {
          type: input.vote,
          suggestionId: input.id,
          userId,
        },
      });

      await ctx.db.subscription.upsert({
        where: {
          userId_type_originId: {
            userId,
            type: "SUGGESTION",
            originId: input.id,
          },
        },
        create: {
          userId,
          type: "SUGGESTION",
          originId: input.id,
        },
        update: {},
      });

      await prismaEventService.createEvent({
        type: "SUGGESTION_CREATED",
        originId: input.id,
        originType: "SUGGESTION",
        actorId: ctx.session.user.id,
        metadata: { voteType: input.vote },
      });

      return vote;
    }),
});
