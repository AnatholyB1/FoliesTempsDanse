import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// READ (GET MANY)
export const getSaisons = query({
  handler: async (ctx) => {
    return await ctx.db.query("saison").collect();
  },
});

// CREATE
export const createSaison = mutation({
  args: {
    nom: v.string(),
    annee: v.string(),
    description: v.optional(v.string()),
    active: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    if (args.active) {
      const saisons = await ctx.db
        .query("saison")
        .filter((q) => q.eq(q.field("active"), true))
        .collect();
      for (const saison of saisons) {
        await ctx.db.patch(saison._id, { active: false });
      }
    }
    return await ctx.db.insert("saison", args);
  },
});

// UPDATE
export const updateSaison = mutation({
  args: {
    id: v.id("saison"),
    nom: v.optional(v.string()),
    annee: v.optional(v.string()),
    description: v.optional(v.string()),
    active: v.optional(v.boolean()),
  },
  handler: async (ctx, { id, ...data }) => {
    if (data.active) {
      const saisons = await ctx.db
        .query("saison")
        .filter((q) => q.eq(q.field("active"), true))
        .collect();
      for (const saison of saisons) {
        if (saison._id !== id) {
          await ctx.db.patch(saison._id, { active: false });
        }
      }
    }
    await ctx.db.patch(id, data);
    return await ctx.db.get(id);
  },
});

// DELETE
export const deleteSaison = mutation({
  args: { id: v.id("saison") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
    return id;
  },
});

// DUPLICATE
export const duplicateSaison = mutation({
  args: { id: v.id("saison") },
  handler: async (ctx, { id }) => {
    const original = await ctx.db.get(id);
    if (!original) throw new Error("Saison introuvable");
    const { _id, _creationTime, ...fields } = original;
    return await ctx.db.insert("saison", {
      ...fields,
      nom: `Copie de ${fields.nom}`,
      active: false,
    });
  },
});
