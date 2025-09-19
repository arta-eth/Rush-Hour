import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema(
  {
    Podcasts: defineTable({
      id: v.string(),
      title: v.string(),
      description: v.string(),
      host: v.string(),
      category: v.string(),
      participants: v.number(),
      likes: v.number(),
      comments: v.number(),
      image: v.string(),
      poster: v.object({
        name: v.string(),
        avatar: v.string(),
      }),
    })
  },
  { schemaValidation: false }
);
