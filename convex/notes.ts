import { v } from "convex/values";
import { query } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("notes").collect();
  },
});

export const getDocById = query({
  args: { docId: v.id("notes") },
  handler: async (ctx, args) => {
    const retrivedDoc = await ctx.db.get(args.docId);
    return retrivedDoc;
  },
});

export const getDocsByUserId = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("notes")
      .withIndex("by_userId", q => q.eq("userId", args.userId))
      .collect();
  },
});
