import {mutation} from "./_generated/server";
import {v} from "convex/values";
// Retirer un costume d'une danseuse
export const removeCostumeFromDanseuse = mutation({
  args: {
    costumeId: v.id("costumes"),
    danseuseId: v.id("danseuses"),
    choregraphieId: v.union(v.id("roles_choregraphie"), v.id("groupes_choregraphie")),
  },
  handler: async (ctx, { costumeId, danseuseId, choregraphieId }) => {
    const assign = await ctx.db.query("assignations")
      .withIndex("by_danseuseId_and_choregraphieId", q =>
        q.eq("danseuseId", danseuseId).eq("choregraphieId", choregraphieId)
      ).first();
    if (!assign || !assign.costumeIds?.includes(costumeId)) {
      throw new Error("Aucune assignation trouvée pour ce costume");
    }
    const newCostumeIds = assign.costumeIds.filter(id => id !== costumeId);
    await ctx.db.patch(assign._id, { costumeIds: newCostumeIds });
    // Rendre le costume à la réserve
    const costume = await ctx.db.get(costumeId);
    if (costume && typeof costume.quantite === "number") {
      await ctx.db.patch(costumeId, { quantite: costume.quantite + 1 });
    }
    return { success: true, message: "Costume retiré" };
  }
});

// Retirer un accessoire d'une danseuse
export const removeAccessoireFromDanseuse = mutation({
  args: {
    accessoireId: v.id("accessoires"),
    danseuseId: v.id("danseuses"),
    choregraphieId: v.union(v.id("roles_choregraphie"), v.id("groupes_choregraphie")),
  },
  handler: async (ctx, { accessoireId, danseuseId, choregraphieId }) => {
    const assign = await ctx.db.query("assignations")
      .withIndex("by_danseuseId_and_choregraphieId", q =>
        q.eq("danseuseId", danseuseId).eq("choregraphieId", choregraphieId)
      ).first();
    if (!assign || !assign.accessoireIds?.includes(accessoireId)) {
      throw new Error("Aucune assignation trouvée pour cet accessoire");
    }
    const newAccessoireIds = assign.accessoireIds.filter(id => id !== accessoireId);
    await ctx.db.patch(assign._id, { accessoireIds: newAccessoireIds });
    // Rendre l’accessoire à la réserve
    const accessoire = await ctx.db.get(accessoireId);
    if (accessoire && typeof accessoire.quantite === "number") {
      await ctx.db.patch(accessoireId, { quantite: accessoire.quantite + 1 });
    }
    return { success: true, message: "Accessoire retiré" };
  }
});

// Retirer une danseuse d’un rôle (suppression de l’assignation)
export const removeDanseuseFromRole = mutation({
  args: {
    danseuseId: v.id("danseuses"),
    roleId: v.id("roles_choregraphie"),
  },
  handler: async (ctx, { danseuseId, roleId }) => {
    const existing = await ctx.db
      .query("assignations")
      .withIndex("by_danseuseId_and_choregraphieId", q =>
        q.eq("danseuseId", danseuseId).eq("choregraphieId", roleId)
      )
      .first();
    if (existing) {
      await ctx.db.delete(existing._id);
    }
    return { success: true, message: "Danseuse retirée du rôle" };
  },
});

// Retirer une danseuse d’un groupe (suppression de l’assignation)
export const removeDanseuseFromGroupe = mutation({
  args: {
    danseuseId: v.id("danseuses"),
    groupeId: v.id("groupes_choregraphie"),
  },
  handler: async (ctx, { danseuseId, groupeId }) => {
    const existing = await ctx.db
      .query("assignations")
      .withIndex("by_danseuseId_and_choregraphieId", q =>
        q.eq("danseuseId", danseuseId).eq("choregraphieId", groupeId)
      )
      .first();
    if (existing) {
      await ctx.db.delete(existing._id);
    }
    return { success: true, message: "Danseuse retirée du groupe" };
  },
});

// Assigner un costume à une danseuse
export const assignCostumeToDanseuse = mutation({
  args: {
    costumeId: v.id("costumes"),
    danseuseId: v.id("danseuses"),
    parentChoregraphieId: v.id("choregraphies"),
    choregraphieId: v.union(v.id("roles_choregraphie"), v.id("groupes_choregraphie")),
  },
  handler: async (ctx, { costumeId, danseuseId, parentChoregraphieId, choregraphieId }) => {
    const costume = await ctx.db.get(costumeId);
    if (!costume || typeof costume.quantite !== "number" || costume.quantite <= 0) {
      throw new Error("Costume non disponible");
    }
    const danseuse = await ctx.db.get(danseuseId);
    if (!danseuse) throw new Error("Danseuse inexistante");
    const chore = await ctx.db.get(choregraphieId);
    if (!chore) throw new Error("Chorégraphie/rôle/groupe inexistant");

    const assign = await ctx.db.query("assignations")
      .withIndex("by_danseuseId_and_choregraphieId", q =>
        q.eq("danseuseId", danseuseId).eq("choregraphieId", choregraphieId)
      )
      .filter(q => q.eq(q.field("parentChoregraphieId"), parentChoregraphieId))
      .first();

    if (assign) {
      const costumeIds = assign.costumeIds ?? [];
      if (!costumeIds.includes(costumeId)) {
        await ctx.db.patch(assign._id, { costumeIds: [...costumeIds, costumeId] });
      }
    } else {
      await ctx.db.insert("assignations", {
        danseuseId,
        parentChoregraphieId,
        choregraphieId,
        costumeIds: [costumeId],
        accessoireIds: [],
      });
    }
    await ctx.db.patch(costumeId, { quantite: costume.quantite - 1 });
    return { success: true, message: "Costume assigné" };
  }
});

// Assigner un accessoire à une danseuse
export const assignAccessoireToDanseuse = mutation({
  args: {
    accessoireId: v.id("accessoires"),
    danseuseId: v.id("danseuses"),
    parentChoregraphieId: v.id("choregraphies"),
    choregraphieId: v.union(v.id("roles_choregraphie"), v.id("groupes_choregraphie")),
  },
  handler: async (ctx, { accessoireId, danseuseId, parentChoregraphieId, choregraphieId }) => {
    const accessoire = await ctx.db.get(accessoireId);
    if (!accessoire || typeof accessoire.quantite !== "number" || accessoire.quantite <= 0) {
      throw new Error("Accessoire non disponible");
    }
    const danseuse = await ctx.db.get(danseuseId);
    if (!danseuse) throw new Error("Danseuse inexistante");
    const chore = await ctx.db.get(choregraphieId);
    if (!chore) throw new Error("Chorégraphie/rôle/groupe inexistant");

    const assign = await ctx.db.query("assignations")
      .withIndex("by_danseuseId_and_choregraphieId", q =>
        q.eq("danseuseId", danseuseId).eq("choregraphieId", choregraphieId)
      )
      .filter(q => q.eq(q.field("parentChoregraphieId"), parentChoregraphieId))
      .first();

    if (assign) {
      const accessoireIds = assign.accessoireIds ?? [];
      if (!accessoireIds.includes(accessoireId)) {
        await ctx.db.patch(assign._id, { accessoireIds: [...accessoireIds, accessoireId] });
      }
    } else {
      await ctx.db.insert("assignations", {
        danseuseId,
        parentChoregraphieId,
        choregraphieId,
        costumeIds: [],
        accessoireIds: [accessoireId],
      });
    }
    await ctx.db.patch(accessoireId, { quantite: accessoire.quantite - 1 });
    return { success: true, message: "Accessoire assigné" };
  }
});

// Assigner une danseuse à un rôle
export const assignDanseuseToRole = mutation({
  args: {
    danseuseId: v.id("danseuses"),
    roleId: v.id("roles_choregraphie"),
    parentChoregraphieId: v.id("choregraphies"),
  },
  handler: async (ctx, { danseuseId, roleId, parentChoregraphieId }) => {
    const existing = await ctx.db
      .query("assignations")
      .withIndex("by_danseuseId_and_choregraphieId", q =>
        q.eq("danseuseId", danseuseId).eq("choregraphieId", roleId)
      )
      .filter(q => q.eq(q.field("parentChoregraphieId"), parentChoregraphieId))
      .first();
    if (!existing) {
      await ctx.db.insert("assignations", {
        danseuseId,
        parentChoregraphieId,
        choregraphieId: roleId,
        costumeIds: [],
        accessoireIds: [],
      });
    }
    return { success: true, message: "Danseuse assignée au rôle" };
  },
});

// Assigner une danseuse à un groupe
export const assignDanseuseToGroupe = mutation({
  args: {
    danseuseId: v.id("danseuses"),
    groupeId: v.id("groupes_choregraphie"),
    parentChoregraphieId: v.id("choregraphies"),
  },
  handler: async (ctx, { danseuseId, groupeId, parentChoregraphieId }) => {
    const existing = await ctx.db
      .query("assignations")
      .withIndex("by_danseuseId_and_choregraphieId", q =>
        q.eq("danseuseId", danseuseId).eq("choregraphieId", groupeId)
      )
      .filter(q => q.eq(q.field("parentChoregraphieId"), parentChoregraphieId))
      .first();
    if (!existing) {
      await ctx.db.insert("assignations", {
        danseuseId,
        parentChoregraphieId,
        choregraphieId: groupeId,
        costumeIds: [],
        accessoireIds: [],
      });
    }
    return { success: true, message: "Danseuse assignée au groupe" };
  },
});