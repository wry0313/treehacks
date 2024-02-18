import { v } from "convex/values";
import { query } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("notes").collect();
  },
});

export const getNoteById = query({
  args: { noteId: v.id("notes") },
  handler: async (ctx, args) => {
    const retrivedNote = await ctx.db.get(args.noteId);
    return retrivedNote;
  },
});

export const getNotesByUserId = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("notes")
      .withIndex("by_userId", q => q.eq("userId", args.userId))
      .collect();
  },
});
