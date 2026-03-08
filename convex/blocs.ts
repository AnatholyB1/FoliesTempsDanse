import {mutation, query} from "./_generated/server";
import {v} from "convex/values";

// CREATE
export const createBloc = mutation({
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
export const getBloc = query({
  args: { id: v.id("tableaux") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// READ (GET MANY)
export const getBlocs = query({
  handler: async (ctx) => {
    return await ctx.db.query("tableaux").collect();
  },
});

// UPDATE
export const updateBloc = mutation({
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
export const deleteBloc = mutation({
  args: { id: v.id("tableaux") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
    return id;
  },
});

// DUPLICATE
export const duplicateBloc = mutation({
  args: { id: v.id("tableaux") },
  handler: async (ctx, { id }) => {
    const original = await ctx.db.get(id);
    if (!original) throw new Error("Bloc introuvable");
    const { _id, _creationTime, ...fields } = original;
    return await ctx.db.insert("tableaux", {
      ...fields,
      nom: `Copie de ${fields.nom}`,
    });
  },
});