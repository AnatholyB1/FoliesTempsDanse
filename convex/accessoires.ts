import {mutation, query} from "./_generated/server";
import {v} from "convex/values";

// CREATE
export const createAccessoire = mutation({
  args: {
    photo: v.optional(v.string()),
    descriptif: v.optional(v.string()),
    sexe: v.optional(v.string()),
    type: v.optional(v.string()),
    tissu_motif: v.optional(v.string()),
    couleur: v.optional(v.string()),
    taille: v.optional(v.union(v.number(), v.string())),
    quantite:  v.optional(v.number()),
    divers: v.optional(v.string()),
    portant: v.optional(v.number()),
    photo_prise_par: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("accessoires", args);
  },
});

// READ (GET ONE)
export const getAccessoire = query({
  args: {id: v.id("accessoires")},
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// READ (GET MANY)
export const getAccessoires = query({
  handler: async (ctx) => {
    return await ctx.db.query("accessoires").collect();
  },
});

// UPDATE
export const updateAccessoire = mutation({
  args: {
    id: v.id("accessoires"),
    data: v.object({
      photo: v.optional(v.string()),
      descriptif: v.optional(v.string()),
      sexe: v.optional(v.string()),
      type: v.optional(v.string()),
      tissu_motif: v.optional(v.string()),
      couleur: v.optional(v.string()),
      taille: v.optional(v.union(v.number(), v.string())),
      quantite: v.optional(v.number()),
      divers: v.optional(v.string()),
      portant: v.optional(v.number()),
      photo_prise_par: v.optional(v.string()),
    }),
  },
  handler: async (ctx, {id, data}) => {
    await ctx.db.patch(id, data);
    return await ctx.db.get(id);
  },
});

// DELETE
export const deleteAccessoire = mutation({
  args: {id: v.id("accessoires")},
  handler: async (ctx, {id}) => {
    await ctx.db.delete(id);
    return id;
  },
});

// GET Avaialble Quantities
export const getAccessoiresAvailables = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("accessoires").withIndex("by_quantite", (q) => q.gt("quantite", 0)).collect();
  },
});