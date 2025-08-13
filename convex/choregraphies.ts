import {mutation, query} from "./_generated/server";
import {v} from "convex/values";

// CREATE
export const createChoregraphie = mutation({
  args: {
    nom: v.string(),
    tableauId: v.id("tableaux"),
    musique: v.optional(v.string()),
    ordre: v.optional(v.number()),
    duree: v.optional(v.number()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // On place à la fin si ordre non fourni
    let ordre = args.ordre;
    if (ordre === undefined) {
      const count = await ctx.db
        .query("choregraphies")
        .withIndex("by_tableauId", (q) => q.eq("tableauId", args.tableauId))
        .collect();
      ordre = count.length;
    }
    return await ctx.db.insert("choregraphies", { ...args, ordre });
  },
});

// READ (get one)
export const getChoregraphie = query({
  args: { id: v.id("choregraphies") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// READ (get all)
export const getChoregraphies = query({
  handler: async (ctx) => {
    return await ctx.db.query("choregraphies").collect();
  }
});

// READ (get all for a tableau, triées par ordre)
export const getByTableau = query({
  args: { tableauId: v.id("tableaux") },
  handler: async (ctx, { tableauId }) => {
    return await ctx.db
      .query("choregraphies")
      .withIndex("by_tableauId_and_ordre", (q) =>
        q.eq("tableauId", tableauId).gt("ordre", -1) // Assure que l'ordre est défini
      )
      .collect();
  },
});

// READ (get all non liées à ce tableau)
export const getNotInTableau = query({
  args: { tableauId: v.id("tableaux") },
  handler: async (ctx, { tableauId }) => {
    // On récupère toutes les chorégraphies qui ne sont pas liées à ce tableau
    return await ctx.db
      .query("choregraphies")
      .filter((q) => q.neq(q.field("tableauId"), tableauId))
      .collect();
  },
});

// UPDATE
export const updateChoregraphie = mutation({
  args: {
    id: v.id("choregraphies"),
    data: v.object({
      nom: v.optional(v.string()),
      musique: v.optional(v.string()),
      ordre: v.optional(v.number()),
      duree: v.optional(v.number()),
      description: v.optional(v.string()),
      tableauId: v.optional(v.id("tableaux")),
    }),
  },
  handler: async (ctx, { id, data }) => {
    await ctx.db.patch(id, data);
    return await ctx.db.get(id);
  },
});

// DELETE
export const deleteChoregraphie = mutation({
  args: { id: v.id("choregraphies") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
    return id;
  },
});

// LIER à un tableau
export const lierATableau = mutation({
  args: { id: v.id("choregraphies"), tableauId: v.id("tableaux") },
  handler: async (ctx, { id, tableauId }) => {
    // On place à la fin
    const count = await ctx.db
      .query("choregraphies")
      .withIndex("by_tableauId", (q) => q.eq("tableauId", tableauId))
      .collect();
    await ctx.db.patch(id, { tableauId, ordre: count.length });
    return await ctx.db.get(id);
  },
});

// DÉTACHER d’un tableau
export const detacherDeTableau = mutation({
  args: { id: v.id("choregraphies") },
  handler: async (ctx, { id }) => {
    await ctx.db.patch(id, { tableauId: undefined, ordre: undefined });
    return id;
  },
});

// RÉORDONNER dans un tableau
export const reorderInTableau = mutation({
  args: {
    order: v.array(v.id("choregraphies")),
  },
  handler: async (ctx, { order }) => {
    // On met à jour l’ordre de chaque chorégraphie
    for (let i = 0; i < order.length; i++) {
      await ctx.db.patch(order[i], { ordre: i });
    }
    return true;
  },
});