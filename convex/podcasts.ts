import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create a new podcast
export const createPodcast = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("Podcasts", args);
  },
});

// Get all podcasts
export const getPodcasts = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("Podcasts").collect();
  },
});

// Update a podcast
export const updatePodcast = mutation({
  args: {
    id: v.string(),
    updates: v.object({
      title: v.optional(v.string()),
      description: v.optional(v.string()),
      host: v.optional(v.string()),
      category: v.optional(v.string()),
      participants: v.optional(v.number()),
      likes: v.optional(v.number()),
      comments: v.optional(v.number()),
      image: v.optional(v.string()),
      poster: v.optional(v.object({
        name: v.string(),
        avatar: v.string(),
      })),
    }),
  },
  handler: async (ctx, args) => {
    const podcast = await ctx.db
      .query("Podcasts")
      .filter((q) => q.eq(q.field("id"), args.id))
      .first();
    
    if (!podcast) {
      throw new Error("Podcast not found");
    }

    return await ctx.db.patch(podcast._id, args.updates);
  },
});

// Delete a podcast
export const deletePodcast = mutation({
  args: {
    id: v.string(),
  },
  handler: async (ctx, args) => {
    const podcast = await ctx.db
      .query("Podcasts")
      .filter((q) => q.eq(q.field("id"), args.id))
      .first();
    
    if (!podcast) {
      throw new Error("Podcast not found");
    }

    return await ctx.db.delete(podcast._id);
  },
});

// Like a podcast
export const likePodcast = mutation({
  args: {
    id: v.string(),
  },
  handler: async (ctx, args) => {
    const podcast = await ctx.db
      .query("Podcasts")
      .filter((q) => q.eq(q.field("id"), args.id))
      .first();
    
    if (!podcast) {
      throw new Error("Podcast not found");
    }

    return await ctx.db.patch(podcast._id, {
      likes: podcast.likes + 1,
    });
  },
});

// Add comment to a podcast
export const addComment = mutation({
  args: {
    id: v.string(),
  },
  handler: async (ctx, args) => {
    const podcast = await ctx.db
      .query("Podcasts")
      .filter((q) => q.eq(q.field("id"), args.id))
      .first();
    
    if (!podcast) {
      throw new Error("Podcast not found");
    }

    return await ctx.db.patch(podcast._id, {
      comments: podcast.comments + 1,
    });
  },
});

// Seed the database with default podcasts
export const seedPodcasts = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if podcasts already exist
    const existingPodcasts = await ctx.db.query("Podcasts").collect();
    if (existingPodcasts.length > 0) {
      return { message: "Podcasts already exist, skipping seed" };
    }

    const defaultPodcasts = [
      {
        id: '1',
        title: 'Tech Talk with AI Sarah',
        description: "Dive deep into the latest technology trends, startups, and innovation with Sarah, an AI expert who's been following the tech scene for years.",
        host: 'AI Sarah',
        category: 'Technology',
        participants: 1247,
        likes: 324,
        comments: 89,
        image: '/api/placeholder/300/200',
        poster: {
          name: 'Alex Chen',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex'
        }
      },
      {
        id: '2',
        title: 'The Philosophy Corner',
        description: "Explore life's biggest questions with Marcus, an AI philosopher who loves debating ethics, consciousness, and the meaning of existence.",
        host: 'AI Marcus',
        category: 'Philosophy',
        participants: 892,
        likes: 198,
        comments: 156,
        image: '/api/placeholder/300/200',
        poster: {
          name: 'Maya Rodriguez',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maya'
        }
      },
      {
        id: '3',
        title: 'Creative Writing Workshop',
        description: 'Join Luna for interactive storytelling sessions where you collaborate to create amazing stories, poems, and creative pieces.',
        host: 'AI Luna',
        category: 'Arts & Creativity',
        participants: 643,
        likes: 445,
        comments: 73,
        image: '/api/placeholder/300/200',
        poster: {
          name: 'Jordan Kim',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jordan'
        }
      },
      {
        id: '4',
        title: 'Business Strategy Sessions',
        description: 'Get insights on entrepreneurship, business strategy, and market analysis from Alex, an AI with extensive business knowledge.',
        host: 'AI Alex',
        category: 'Business',
        participants: 1089,
        likes: 267,
        comments: 124,
        image: '/api/placeholder/300/200',
        poster: {
          name: 'Sam Taylor',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sam'
        }
      },
      {
        id: '5',
        title: 'Science Discoveries',
        description: 'Explore the latest scientific breakthroughs, space exploration, and fascinating discoveries with Dr. Nova, your AI science guide.',
        host: 'AI Dr. Nova',
        category: 'Science',
        participants: 756,
        likes: 512,
        comments: 98,
        image: '/api/placeholder/300/200',
        poster: {
          name: 'Dr. Riley Park',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=riley'
        }
      },
      {
        id: '6',
        title: 'Mental Wellness Chat',
        description: 'A supportive space to discuss mental health, mindfulness, and personal growth with Zen, a compassionate AI counselor.',
        host: 'AI Zen',
        category: 'Health & Wellness',
        participants: 934,
        likes: 389,
        comments: 167,
        image: '/api/placeholder/300/200',
        poster: {
          name: 'Casey Morgan',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=casey'
        }
      }
    ];

    // Insert all default podcasts
    const results = [];
    for (const podcast of defaultPodcasts) {
      const result = await ctx.db.insert("Podcasts", podcast);
      results.push(result);
    }

    return { message: `Successfully seeded ${results.length} podcasts`, ids: results };
  },
});