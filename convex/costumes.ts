import {mutation, query} from "./_generated/server";
import {v} from "convex/values";

// CREATE
export const createCostume = mutation({
    args: {
        photo: v.optional(v.string()),
        descriptif: v.optional(v.string()),
        sexe: v.optional(v.string()),
        type: v.optional(v.string()),
        tissu_motif: v.optional(v.string()),
        couleur: v.optional(v.string()),
        taille: v.optional(v.union(v.number(), v.string())),
        quantite:  v.optional(v.number()),
        emplacement: v.optional(v.string()),
        portant: v.optional(v.number()),
        divers: v.optional(v.string()),
        photo_prise_par: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("costumes", args);
    },
});

// READ (GET ONE)
export const getCostume = query({
    args: { id: v.id("costumes") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

// READ (GET MANY)
export const getCostumes = query({
    handler: async (ctx) => {
        return await ctx.db.query("costumes").collect();
    },
});

// UPDATE
export const updateCostume = mutation({
    args: {
        id: v.id("costumes"),
        data: v.object({
            photo: v.optional(v.string()),
            descriptif: v.optional(v.string()),
            sexe: v.optional(v.string()),
            type: v.optional(v.string()),
            tissu_motif: v.optional(v.string()),
            couleur: v.optional(v.string()),
            taille: v.optional(v.union(v.number(), v.string())),
            quantite: v.optional(v.number()),
            emplacement: v.optional(v.string()),
            portant: v.optional(v.number()),
            divers: v.optional(v.string()),
            photo_prise_par: v.optional(v.string()),
        }),
    },
    handler: async (ctx, { id, data }) => {
        await ctx.db.patch(id, data);
        return await ctx.db.get(id);
    },
});

// DELETE
export const deleteCostume = mutation({
    args: { id: v.id("costumes") },
    handler: async (ctx, { id }) => {
        await ctx.db.delete(id);
        return id;
    },
});

// DUPLICATE
export const duplicateCostume = mutation({
    args: { id: v.id("costumes") },
    handler: async (ctx, { id }) => {
        const original = await ctx.db.get(id);
        if (!original) throw new Error("Costume introuvable");
        const { _id, _creationTime, ...fields } = original;
        return await ctx.db.insert("costumes", {
            ...fields,
            descriptif: `Copie de ${fields.descriptif ?? ""}`.trim(),
        });
    },
});


// get costumes available
export const getCostumesAvailable = query({
    handler: async (ctx) => {
        return await ctx.db.query("costumes")
            .withIndex("by_quantite", (q) => q.gt("quantite", 0))
    .collect();
    }
});


