import {mutation, query} from "./_generated/server";
import {v} from "convex/values";

// CREATE
export const createGroupe = mutation({
  args: {
    tableauId: v.id("choregraphies"),
    nom: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("groupes_choregraphie", {
      choregraphieId: args.tableauId,
      nom: args.nom,
    });
  },
});

// READ (all groupes for a tableau)
export const getGroupesByTableau = query({
  args: { tableauId: v.id("choregraphies") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("groupes_choregraphie")
      .withIndex("by_choregraphieId", (q) => q.eq("choregraphieId", args.tableauId))
      .collect();
  },
});

// READ (one groupe)
export const getGroupe = query({
  args: { id: v.id("groupes_choregraphie") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// UPDATE
export const updateGroupe = mutation({
  args: {
    id: v.id("groupes_choregraphie"),
    nom: v.optional(v.string()),
    tableauId: v.optional(v.id("choregraphies")),
  },
  handler: async (ctx, args) => {
    const { id, tableauId, ...rest } = args;
    await ctx.db.patch(id, {...rest, ...(tableauId !== undefined ? {choregraphieId: tableauId} : {})});
    return true;
  },
});

// DELETE
export const deleteGroupe = mutation({
  args: { id: v.id("groupes_choregraphie") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return true;
  },
});
