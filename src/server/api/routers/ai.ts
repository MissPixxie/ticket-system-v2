import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { generateTags } from "~/server/ai/aiService";

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
});
