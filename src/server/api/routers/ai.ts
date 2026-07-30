import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { generateTags } from "~/server/ai/generateTags";
import { generateNewsletter } from "~/server/ai/generateNewsLetter";

export const aiRouter = createTRPCRouter({
  generateTags: protectedProcedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const tags = await generateTags(input.text);

      return { tags };
    }),

  generateNewsletter: protectedProcedure
    .input(
      z.object({
        conversationId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const messages = await ctx.db.message.findMany({
        where: {
          conversationId: input.conversationId,
        },
        include: {
          sender: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      const conversationText = messages
        .map(
          (msg) => `${msg.sender?.name ?? "Okänd användare"}: ${msg.content}`,
        )
        .join("\n\n");

      const newsletter = await generateNewsletter(conversationText);

      return { newsletter };
    }),
});
