import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const auditLogRouter = createTRPCRouter({
  list: protectedProcedure
    .input(
      z.object({
        search: z.string().optional(),
        type: z.string().optional(),
        page: z.number().default(1),
        limit: z.number().default(20),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.auditLog.findMany({
        where: {
          type: input.type || undefined,
          message: input.search
            ? {
                contains: input.search.toLowerCase(),
              }
            : undefined,
        },
        skip: (input.page - 1) * input.limit,
        take: input.limit,
        orderBy: { createdAt: "desc" },
        include: {
          actor: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
    }),
});
