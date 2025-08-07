import {mutation} from "./_generated/server";
import {v} from "convex/values";

// Génère l'URL d'upload
export const generateUploadUrl = mutation({
    handler: async (ctx) => {
        const uploadUrl = await ctx.storage.generateUploadUrl();
        return { uploadUrl };
    },
});

// Retourne l'URL publique du fichier uploadé
export const getStorageUrl = mutation({
    args: { storageId: v.string() },
    handler: async (ctx, { storageId }) => {
        const url = await ctx.storage.getUrl(storageId);
        return { url };
    },
});