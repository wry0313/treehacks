import { v } from "convex/values";
import { action, mutation, query } from "./_generated/server";

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const insertNoteImage = mutation({
  args: { noteId: v.string(), imageStorageId: v.id("_storage") },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("noteImages", {
      noteId: args.noteId,
      imageStorageId: args.imageStorageId,
      processingStatus: "processing",
    });
    return id;
  },
});

export const setStatusToComplete = mutation({
  args: { noteImageId: v.id("noteImages") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.noteImageId, {
      processingStatus: "complete",
    });
  },
});

// export const getNoteImagesByNoteId = query({
//   args: { noteId: v.string() },
//   handler: async (ctx, args) => {
//     const images = await ctx.db
//       .query("noteImages")
//       .withIndex("by_noteId", (q) => q.eq("noteId", args.noteId))
//       .collect();

//     const res = images.map(async (image) => {
//       const url = await ctx.storage.getUrl(image.imageStorageId);
//       return url;
//     });
//     return Promise.all(res);
//   },
// });

export const getImageUrlFromStorageId = action({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    const res = await ctx.storage.getUrl(args.storageId);
    return Promise.resolve(res);
  },
});

export const getNoteImageUrlAndStatusByNoteId = query({
  args: { noteId: v.string() },
  handler: async (ctx, args) => {
    const images = await ctx.db
      .query("noteImages")
      .withIndex("by_noteId", (q) => q.eq("noteId", args.noteId))
      .collect();

    const res = images.map(async (image) => {
      const url = await ctx.storage.getUrl(image.imageStorageId);
      return { url, status: image.processingStatus };
    });
    return Promise.all(res);
  },
});