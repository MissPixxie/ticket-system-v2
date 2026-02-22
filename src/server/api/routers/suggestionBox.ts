import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const suggestionBoxRouter = createTRPCRouter({
  listSuggestions: protectedProcedure
    .input(z.object({ suggestionBoxId: z.string() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const suggestions = await ctx.db.suggestion.findMany({
        where: {
          suggestionBoxId: input.suggestionBoxId,
        },
        include: {
          votes: true,
          user: true,
        },
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
      return ctx.db.suggestion.create({
        data: {
          content: input.content,
          suggestionBoxId: input.suggestionBoxId,
          userId: ctx.session.user.id,
          isAnonymous: input.isAnonymous ?? false,
        },
      });
    }),

  updateSuggestion: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        vote: z.enum(["UP"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const existingVote = await ctx.db.vote.findFirst({
        where: {
          suggestionId: input.id,
          userId,
        },
      });
      if (existingVote) {
        return ctx.db.vote.delete({
          where: { id: existingVote.id },
        });
      }
      return ctx.db.vote.create({
        data: {
          type: input.vote,
          suggestionId: input.id,
          userId,
        },
      });
    }),
});
