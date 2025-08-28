import {mutation, query} from "./_generated/server";
import {v} from "convex/values";
// CREATE
export const createRoleChoregraphie = mutation({
  args: {
    choregraphieId: v.id("choregraphies"),
    nom: v.string(),
    danseuseId: v.optional(v.id("danseuses")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("roles_choregraphie", args);
  },
});

// READ (un rôle de chorégraphie)
export const getRoleChoregraphie = query({
  args: { id: v.id("roles_choregraphie") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// READ (tous les rôles d'une chorégraphie)
export const getRoleChoregraphieByChoregraphie = query({
  args: { choregraphieId: v.id("choregraphies") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("roles_choregraphie")
      .withIndex("by_choregraphieId", (q) => q.eq("choregraphieId", args.choregraphieId))
      .unique()
  },
});

// UPDATE
export const updateRoleChoregraphie = mutation({
  args: {
    id: v.id("roles_choregraphie"),
    nom: v.optional(v.string()),
    danseuseId: v.optional(v.id("danseuses")),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    await ctx.db.patch(id, data);
    return await ctx.db.get(id);
  },
});

// DELETE
export const deleteRoleChoregraphie = mutation({
  args: { id: v.id("roles_choregraphie") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return args.id;
  },
});
