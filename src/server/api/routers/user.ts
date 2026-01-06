import { optional, z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const userRouter = createTRPCRouter({
  // lägg till kontroll av behörighet för säkerhetsskull senare
  listAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: {
          select: {
            name: true,
          },
        },
        createdAt: true,
      },
    });
  }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        password: z.string().min(6),
        roleId: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const role = await ctx.db.role.findUnique({
          where: { id: input.roleId },
        });

        if (!role) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Ogiltig roll vald",
          });
        }
        return ctx.db.user.create({
          data: {
            name: input.name,
            email: input.email,
            password: input.password,
            role: { connect: { id: input.roleId } },
          },
        });
      } catch (error: any) {
        if (error.code === "P2002") {
          throw new TRPCError({
            code: "CONFLICT",
            message: "E-postadressen används redan",
          });
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Kunde inte skapa användaren",
        });
      }
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
        throw new Error("Ingen användare hittades med den e-postadressen");
      }

      // Returnera bara relevant info, aldrig lösenordet
      return { id: user.id, email: user.email, name: user.name };
    }),
});
