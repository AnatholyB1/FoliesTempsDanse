import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
// CREATE
export const createRole = mutation({
  args: {
    role: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("roles", args);
  },
});

// READ (GET ONE)
export const getRole = query({
  args: { id: v.id("roles") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// READ (GET MANY)
export const getRoles = query({
  handler: async (ctx) => {
    return await ctx.db.query("roles").collect();
  },
});

// UPDATE
export const updateRole = mutation({
  args: {
    id: v.id("roles"),
    data: v.object({
      role: v.optional(v.string()),
      description: v.optional(v.string()),
    }),
  },
  handler: async (ctx, { id, data }) => {
    await ctx.db.patch(id, data);
    return await ctx.db.get(id);
  },
});

// DELETE
export const deleteRole = mutation({
  args: { id: v.id("roles") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
    return id;
  },
});
