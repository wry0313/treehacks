import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

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
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

export const insertNewNotes = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("notes", {
      title: "New Notes",
      content: "",
      userId: args.userId,
      createdAt: getCurrentDateTime(),
    });
    return id;
  },
});
function getCurrentDateTime(): string {
  const now = new Date();
  const month = (now.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-based in JS, so add 1
  const day = now.getDate().toString().padStart(2, "0");
  const hour = now.getHours().toString().padStart(2, "0");
  const minute = now.getMinutes().toString().padStart(2, "0");

  return `${month}/${day} ${hour}:${minute}`;
}

export const updateNoteTitle = mutation({
  args: { noteId: v.id("notes"), newTitle: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.noteId, { title: args.newTitle });
  },
});