import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { prismaEventService } from "../services/eventService";
import { createAuditLog } from "~/server/api/services/auditLogService";
import { TRPCError } from "@trpc/server";

export const resourceRouter = createTRPCRouter({
  listResources: protectedProcedure
    .input(z.object({ limit: z.number().optional() }))
    .query(async ({ ctx, input }) => {
      const resources = await ctx.db.resource.findMany({
        take: input?.limit ?? 5,
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return resources;
    }),

  createResource: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        category: z.enum(["DOCUMENTATION", "TUTORIAL", "INFORMATION", "OTHER"]),
        url: z.string().url().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const news = await ctx.db.resource.create({
        data: {
          title: input.title,
          description: input.description,
          category: input.category,
          createdById: ctx.session.user.id,
          url: input.url,
        },
      });

      //   await prismaEventService.createEvent({
      //     type: "RESOURCE_CREATED",
      //     originId: news.id,
      //     originType: "RESOURCE",
      //     actorId: ctx.session.user.id,
      //   });

      //   await createAuditLog({
      //     type: "RESOURCE_CREATED",
      //     severity: "INFO",
      //     entityType: "RESOURCE",
      //     entityId: news.id,
      //     actor: { connect: { id: ctx.session.user.id } },
      //     message: `${ctx.session.user.email} created resource "${news.title}"`,
      //   });

      return news;
    }),

  updateResource: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        description: z.string().optional(),
        category: z
          .enum(["DOCUMENTATION", "TUTORIAL", "INFORMATION", "OTHER"])
          .optional(),
        url: z.string().url().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const resource = await ctx.db.resource.findUnique({
        where: { id: input.id },
      });

      if (!resource) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Resource hittades inte",
        });
      }

      const updatedResource = await ctx.db.resource.update({
        where: { id: input.id },
        data: {
          title: input.title ?? undefined,
          description: input.description ?? undefined,
          category: input.category ?? undefined,
          url: input.url ?? undefined,
        },
      });

      return updatedResource;
    }),
  publishResource: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        isPublished: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.resource.update({
        where: { id: input.id },
        data: {
          isPublished: input.isPublished,
        },
      });
    }),
});
