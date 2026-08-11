import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { generateTags } from "~/server/ai/generateTags";
import { generateNewsletter } from "~/server/ai/generateNewsletter";
import { generateTicketReply } from "~/server/ai/generateTicketReply";

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

  generateConversationSummary: protectedProcedure
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

  generateTicketReply: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        issue: z.string(),
        messages: z.array(
          z.object({
            senderName: z.string(),
            content: z.string(),
          }),
        ),
      }),
    )
    .mutation(async ({ input }) => {
      return generateTicketReply({
        title: input.title,
        issue: input.issue,
        messages: input.messages,
      });
    }),
});
