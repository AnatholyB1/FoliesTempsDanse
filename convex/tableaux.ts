import {mutation, query} from "./_generated/server";
import {v} from "convex/values";

// CREATE
export const createTableau = mutation({
  args: {
    nom: v.string(),
    saisonId: v.id("saison"),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("tableaux", args);
  },
});

// READ (GET ONE)
export const getTableau = query({
  args: { id: v.id("tableaux") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// READ (GET MANY)
export const getTableaux = query({
  handler: async (ctx) => {
    return await ctx.db.query("tableaux").collect();
  },
});

// UPDATE
export const updateTableau = mutation({
  args: {
    id: v.id("tableaux"),
    data: v.object({
      nom: v.optional(v.string()),
      saisonId: v.optional(v.id("saison")),
      description: v.optional(v.string()),
    }),
  },
  handler: async (ctx, { id, data }) => {
    await ctx.db.patch(id, data);
    return await ctx.db.get(id);
  },
});

// DELETE
export const deleteTableau = mutation({
  args: { id: v.id("tableaux") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
    return id;
  },
});