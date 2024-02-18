import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tasks: defineTable({
    text: v.string(),
    isCompleted: v.boolean(),
  }),
  notes: defineTable({
    title: v.string(),
    content: v.string(),
    userId: v.string(),
    createdAt: v.string(),
  }).index("by_userId", ["userId"]),
  users: defineTable({
    name: v.string(),
    email: v.string(),
  }),
  noteImages: defineTable({
    noteId: v.string(),
    imageStorageId: v.id("_storage")
  }).index("by_noteId", ["noteId"]),
  noteLatexPdf: defineTable({
    noteId: v.string(),
    latexStorageId: v.id("_storage")
  }).index("by_noteId", ["noteId"]),
});
