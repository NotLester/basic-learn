import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { posts } from "@/server/db/schema";
import { desc, eq } from "drizzle-orm";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(posts).values({
        name: input.name,
      });
    }),

  getLatest: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.posts.findFirst({
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    });
  }),

  getAllPosts: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.posts.findMany();
  }),

  removeLatestPost: publicProcedure.mutation(async ({ ctx }) => {
    const latestPostId = await ctx.db
      .select({ id: posts.id })
      .from(posts)
      .orderBy(desc(posts.createdAt))
      .limit(1);

    if (latestPostId.length === 0 || !latestPostId[0]?.id) return;
    await ctx.db.delete(posts).where(eq(posts.id, latestPostId[0].id));
  }),

  removePostById: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(posts).where(eq(posts.id, input.id));
    }),
});
