import { z } from "zod";
import { createAuditLog } from "~/server/api/services/auditLogService";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { hashPassword } from "../services/hashService";

export const userRouter = createTRPCRouter({
  listAll: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(20),
        cursor: z.string().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const users = await ctx.db.user.findMany({
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: {
            select: { name: true },
          },
          createdAt: true,
        },
      });

      let nextCursor: typeof input.cursor = null;

      if (users.length > input.limit) {
        const nextItem = users.pop();
        nextCursor = nextItem!.id;
      }

      return {
        users,
        nextCursor,
      };
    }),

  searchUser: protectedProcedure
    .input(
      z.object({
        query: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.user.findMany({
        where: {
          OR: [
            {
              name: {
                contains: input.query,
              },
            },
            {
              email: {
                contains: input.query,
              },
            },
          ],
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: {
            select: {
              name: true,
            },
          },
        },
        take: 10,
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        password: z.string().min(6),
        roleId: z.string().min(1),
        departments: z.array(
          z.enum(["IT", "HR", "CAMPAIGN", "PRODUCT", "CUSTOMERCLUB"]),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const hashedPassword = await hashPassword(input.password);

      try {
        const newUser = await ctx.db.user.create({
          data: {
            name: input.name,
            email: input.email,
            password: input.password,
            role: { connect: { id: input.roleId } },
            departments: {
              create: input.departments.map((dept) => ({
                department: dept,
              })),
            },
          },
          include: {
            role: true,
          },
        });

        createAuditLog({
          type: "USER_CREATED",
          severity: "INFO",
          entityType: "USER",
          entityId: newUser.id,
          actor: {
            connect: { id: ctx.session.user.id },
          },
          message: `${ctx.session.user.email} created user ${newUser.email}`,
        });

        return newUser;
      } catch (error: any) {
        console.error("CREATE USER ERROR:", error);

        if (error.code === "P2002") {
          throw new TRPCError({
            code: "CONFLICT",
            message: "E-postadressen används redan",
          });
        }

        throw error;
      }
    }),

  updateUser: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1),
        roleId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: input.id },
        include: { role: true },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Användaren finns inte",
        });
      }

      if (user.role?.name === "ADMIN") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Det går inte att ändra en administratör",
        });
      }

      const updatedUser = await ctx.db.user.update({
        where: { id: input.id },
        data: {
          name: input.name,
          role: {
            connect: { id: input.roleId },
          },
        },
        include: { role: true },
      });

      const diff: Record<string, any> = {};

      if (user.name !== input.name) {
        diff.name = {
          old: user.name,
          new: input.name,
        };
      }

      if (user.role?.id !== input.roleId) {
        diff.role = {
          old: user.role?.name,
          new: updatedUser.role?.name,
        };
      }

      createAuditLog({
        type: "USER_UPDATED",
        severity: "INFO",
        entityType: "USER",
        entityId: updatedUser.id,
        actor: {
          connect: { id: ctx.session.user.id },
        },
        message: `${ctx.session.user.email} updated user ${updatedUser.email}`,
        diff,
      });

      return updatedUser;
    }),

  deleteUser: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: input.id },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Användaren finns inte",
        });
      }

      const deletedUser = await ctx.db.user.delete({
        where: {
          id: input.id,
        },
      });

      createAuditLog({
        type: "USER_DELETED",
        severity: "WARNING",
        entityType: "USER",
        entityId: deletedUser.id,
        actor: {
          connect: { id: ctx.session.user.id },
        },
        message: `${ctx.session.user.email} deleted user ${deletedUser.email}`,
      });

      return deletedUser;
    }),

  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { email: input.email },
      });

      if (!user) {
        createAuditLog({
          type: "LOGIN_FAILED",
          severity: "WARNING",
          entityType: "AUTH",
          entityId: "LOGIN",
          message: `Failed login attempt for ${input.email}`,
        });

        throw new Error("Ingen användare hittades med den e-postadressen");
      }

      createAuditLog({
        type: "LOGIN_SUCCESS",
        severity: "INFO",
        entityType: "USER",
        entityId: user.id,
        actor: {
          connect: { id: user.id },
        },
        message: `${user.email} logged in`,
      });

      return { id: user.id, email: user.email, name: user.name };
    }),
});
