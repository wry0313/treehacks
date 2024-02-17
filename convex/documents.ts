import { v } from "convex/values";
import { query } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("documents").collect();
  },
});

export const getDocById = query({
  args: { docId: v.id("documents") },
  handler: async (ctx, args) => {
    const retrivedDoc = await ctx.db.get(args.docId);
    return retrivedDoc;
  },
});

export const getDocsByUserId = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("documents")
      .filter({ userId: args.userId })
      .collect();
  },
});
