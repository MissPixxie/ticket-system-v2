import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { createAuditLog } from "~/server/api/services/auditLogService";
import { prismaEventService } from "../services/eventService";
import { TRPCError } from "@trpc/server";
import { EventOrigin } from "@prisma/client";

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
        sourceType: z.nativeEnum(EventOrigin),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      switch (input.sourceType) {
        case EventOrigin.TICKET:
          return ctx.db.ticket.update({
            where: { id: input.sourceId },
            data: {
              tags: {
                connect: { id: input.tagId },
              },
            },
          });

        case EventOrigin.QUESTION:
          return ctx.db.question.update({
            where: { id: input.sourceId },
            data: {
              tags: {
                connect: { id: input.tagId },
              },
            },
          });

        case EventOrigin.SUGGESTION:
          return ctx.db.suggestion.update({
            where: { id: input.sourceId },
            data: {
              tags: {
                connect: { id: input.tagId },
              },
            },
          });

        case EventOrigin.NEWS:
          return ctx.db.news.update({
            where: { id: input.sourceId },
            data: {
              tags: {
                connect: { id: input.tagId },
              },
            },
          });

        case EventOrigin.RESOURCE:
          return ctx.db.resource.update({
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
        sourceType: z.nativeEnum(EventOrigin),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      switch (input.sourceType) {
        case EventOrigin.TICKET:
          return ctx.db.ticket.update({
            where: { id: input.sourceId },
            data: {
              tags: {
                disconnect: { id: input.tagId },
              },
            },
          });

        case EventOrigin.QUESTION:
          return ctx.db.question.update({
            where: { id: input.sourceId },
            data: {
              tags: {
                disconnect: { id: input.tagId },
              },
            },
          });

        case EventOrigin.SUGGESTION:
          return ctx.db.suggestion.update({
            where: { id: input.sourceId },
            data: {
              tags: {
                disconnect: { id: input.tagId },
              },
            },
          });

        case EventOrigin.NEWS:
          return ctx.db.news.update({
            where: { id: input.sourceId },
            data: {
              tags: {
                disconnect: { id: input.tagId },
              },
            },
          });

        case EventOrigin.RESOURCE:
          return ctx.db.resource.update({
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
