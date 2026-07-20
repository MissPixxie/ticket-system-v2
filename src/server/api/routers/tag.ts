import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { createAuditLog } from "~/server/api/services/auditLogService";
import { prismaEventService } from "../services/eventService";
import { TRPCError } from "@trpc/server";
import { Source } from "@prisma/client";

export const tagRouter = createTRPCRouter({
  createTag: protectedProcedure
    .input(
      z.object({
        name: z.string().min(2).max(100),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const tag = await ctx.db.tag.create({
        data: {
          name: input.name,
        },
      });

      return tag;
    }),

  deleteTag: protectedProcedure
    .input(
      z.object({
        tagId: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { tagId } = input;
      const tag = await ctx.db.tag.delete({
        where: {
          id: tagId,
        },
      });
      return tag;
    }),

  addTagToSource: protectedProcedure
    .input(
      z.object({
        tagId: z.string().min(1),
        sourceId: z.string().min(1),
        sourceType: z.nativeEnum(Source),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      switch (input.sourceType) {
        case Source.TICKET:
          await ctx.db.ticket.update({
            where: { id: input.sourceId },
            data: {
              tags: {
                connect: { id: input.tagId },
              },
            },
          });
        case Source.QUESTION:
          await ctx.db.question.update({
            where: { id: input.sourceId },
            data: {
              tags: {
                connect: { id: input.tagId },
              },
            },
          });
        case Source.SUGGESTION:
          await ctx.db.suggestion.update({
            where: { id: input.sourceId },
            data: {
              tags: {
                connect: { id: input.tagId },
              },
            },
          });
        case Source.NEWS:
          await ctx.db.news.update({
            where: { id: input.sourceId },
            data: {
              tags: {
                connect: { id: input.tagId },
              },
            },
          });
        case Source.RESOURCE:
          await ctx.db.resource.update({
            where: { id: input.sourceId },
            data: {
              tags: {
                connect: { id: input.tagId },
              },
            },
          });
      }
    }),

  removeTagFromSource: protectedProcedure
    .input(
      z.object({
        tagId: z.string().min(1),
        sourceId: z.string().min(1),
        sourceType: z.nativeEnum(Source),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      switch (input.sourceType) {
        case Source.TICKET:
          await ctx.db.ticket.update({
            where: { id: input.sourceId },
            data: {
              tags: {
                disconnect: { id: input.tagId },
              },
            },
          });
        case Source.QUESTION:
          await ctx.db.question.update({
            where: { id: input.sourceId },
            data: {
              tags: {
                disconnect: { id: input.tagId },
              },
            },
          });
        case Source.SUGGESTION:
          await ctx.db.suggestion.update({
            where: { id: input.sourceId },
            data: {
              tags: {
                disconnect: { id: input.tagId },
              },
            },
          });
        case Source.NEWS:
          await ctx.db.news.update({
            where: { id: input.sourceId },
            data: {
              tags: {
                disconnect: { id: input.tagId },
              },
            },
          });
        case Source.RESOURCE:
          await ctx.db.resource.update({
            where: { id: input.sourceId },
            data: {
              tags: {
                disconnect: { id: input.tagId },
              },
            },
          });
      }
    }),
});
