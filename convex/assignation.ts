import {mutation} from "./_generated/server";
import {v} from "convex/values";
// Retirer un costume d une danseuse
export const removeCostumeFromDanseuse = mutation({
  args: {
    costumeId: v.id("costumes"),
    danseuseId: v.id("danseuses"),
    roleOuGroupeId: v.union(v.id("roles_choregraphie"), v.id("groupes_choregraphie")),
  },
  handler: async (ctx, { costumeId, danseuseId, roleOuGroupeId }) => {
    const assign = await ctx.db.query("assignations")
      .withIndex("by_danseuseId_and_choregraphieId", q =>
        q.eq("danseuseId", danseuseId).eq("choregraphieId", roleOuGroupeId)
      ).first();
    if (!assign || !assign.costumeIds?.includes(costumeId)) {
      throw new Error("Aucune assignation trouvee pour ce costume");
    }
    const newCostumeIds = assign.costumeIds.filter(id => id !== costumeId);
    await ctx.db.patch(assign._id, { costumeIds: newCostumeIds });
    const costume = await ctx.db.get(costumeId);
    if (costume && typeof costume.quantite === "number") {
      await ctx.db.patch(costumeId, { quantite: costume.quantite + 1 });
    }
    return { success: true, message: "Costume retire" };
  }
});

// Retirer un accessoire d une danseuse
export const removeAccessoireFromDanseuse = mutation({
  args: {
    accessoireId: v.id("accessoires"),
    danseuseId: v.id("danseuses"),
    roleOuGroupeId: v.union(v.id("roles_choregraphie"), v.id("groupes_choregraphie")),
  },
  handler: async (ctx, { accessoireId, danseuseId, roleOuGroupeId }) => {
    const assign = await ctx.db.query("assignations")
      .withIndex("by_danseuseId_and_choregraphieId", q =>
        q.eq("danseuseId", danseuseId).eq("choregraphieId", roleOuGroupeId)
      ).first();
    if (!assign || !assign.accessoireIds?.includes(accessoireId)) {
      throw new Error("Aucune assignation trouvee pour cet accessoire");
    }
    const newAccessoireIds = assign.accessoireIds.filter(id => id !== accessoireId);
    await ctx.db.patch(assign._id, { accessoireIds: newAccessoireIds });
    const accessoire = await ctx.db.get(accessoireId);
    if (accessoire && typeof accessoire.quantite === "number") {
      await ctx.db.patch(accessoireId, { quantite: accessoire.quantite + 1 });
    }
    return { success: true, message: "Accessoire retire" };
  }
});

// Retirer une danseuse d un role
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
    return { success: true, message: "Danseuse retiree du role" };
  },
});

// Retirer une danseuse d un groupe
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
    return { success: true, message: "Danseuse retiree du groupe" };
  },
});

// Assigner un costume a une danseuse
export const assignCostumeToDanseuse = mutation({
  args: {
    costumeId: v.id("costumes"),
    danseuseId: v.id("danseuses"),
    parentTableauId: v.id("choregraphies"),
    roleOuGroupeId: v.union(v.id("roles_choregraphie"), v.id("groupes_choregraphie")),
  },
  handler: async (ctx, { costumeId, danseuseId, parentTableauId, roleOuGroupeId }) => {
    const costume = await ctx.db.get(costumeId);
    if (!costume || typeof costume.quantite !== "number" || costume.quantite <= 0) {
      throw new Error("Costume non disponible");
    }
    const danseuse = await ctx.db.get(danseuseId);
    if (!danseuse) throw new Error("Danseuse inexistante");
    const chore = await ctx.db.get(roleOuGroupeId);
    if (!chore) throw new Error("Role/groupe inexistant");

    const assign = await ctx.db.query("assignations")
      .withIndex("by_danseuseId_and_choregraphieId", q =>
        q.eq("danseuseId", danseuseId).eq("choregraphieId", roleOuGroupeId)
      )
      .filter(q => q.eq(q.field("parentChoregraphieId"), parentTableauId))
      .first();

    if (assign) {
      const costumeIds = assign.costumeIds ?? [];
      if (!costumeIds.includes(costumeId)) {
        await ctx.db.patch(assign._id, { costumeIds: [...costumeIds, costumeId] });
      }
    } else {
      await ctx.db.insert("assignations", {
        danseuseId,
        parentChoregraphieId: parentTableauId,
        choregraphieId: roleOuGroupeId,
        costumeIds: [costumeId],
        accessoireIds: [],
      });
    }
    await ctx.db.patch(costumeId, { quantite: costume.quantite - 1 });
    return { success: true, message: "Costume assigne" };
  }
});

// Assigner un accessoire a une danseuse
export const assignAccessoireToDanseuse = mutation({
  args: {
    accessoireId: v.id("accessoires"),
    danseuseId: v.id("danseuses"),
    parentTableauId: v.id("choregraphies"),
    roleOuGroupeId: v.union(v.id("roles_choregraphie"), v.id("groupes_choregraphie")),
  },
  handler: async (ctx, { accessoireId, danseuseId, parentTableauId, roleOuGroupeId }) => {
    const accessoire = await ctx.db.get(accessoireId);
    if (!accessoire || typeof accessoire.quantite !== "number" || accessoire.quantite <= 0) {
      throw new Error("Accessoire non disponible");
    }
    const danseuse = await ctx.db.get(danseuseId);
    if (!danseuse) throw new Error("Danseuse inexistante");
    const chore = await ctx.db.get(roleOuGroupeId);
    if (!chore) throw new Error("Role/groupe inexistant");

    const assign = await ctx.db.query("assignations")
      .withIndex("by_danseuseId_and_choregraphieId", q =>
        q.eq("danseuseId", danseuseId).eq("choregraphieId", roleOuGroupeId)
      )
      .filter(q => q.eq(q.field("parentChoregraphieId"), parentTableauId))
      .first();

    if (assign) {
      const accessoireIds = assign.accessoireIds ?? [];
      if (!accessoireIds.includes(accessoireId)) {
        await ctx.db.patch(assign._id, { accessoireIds: [...accessoireIds, accessoireId] });
      }
    } else {
      await ctx.db.insert("assignations", {
        danseuseId,
        parentChoregraphieId: parentTableauId,
        choregraphieId: roleOuGroupeId,
        costumeIds: [],
        accessoireIds: [accessoireId],
      });
    }
    await ctx.db.patch(accessoireId, { quantite: accessoire.quantite - 1 });
    return { success: true, message: "Accessoire assigne" };
  }
});

// Assigner une danseuse a un role
export const assignDanseuseToRole = mutation({
  args: {
    danseuseId: v.id("danseuses"),
    roleId: v.id("roles_choregraphie"),
    parentTableauId: v.id("choregraphies"),
  },
  handler: async (ctx, { danseuseId, roleId, parentTableauId }) => {
    const existing = await ctx.db
      .query("assignations")
      .withIndex("by_danseuseId_and_choregraphieId", q =>
        q.eq("danseuseId", danseuseId).eq("choregraphieId", roleId)
      )
      .filter(q => q.eq(q.field("parentChoregraphieId"), parentTableauId))
      .first();
    if (!existing) {
      await ctx.db.insert("assignations", {
        danseuseId,
        parentChoregraphieId: parentTableauId,
        choregraphieId: roleId,
        costumeIds: [],
        accessoireIds: [],
      });
    }
    return { success: true, message: "Danseuse assignee au role" };
  },
});

// Assigner un costume a toutes les danseuses d un groupe
export const assignCostumeToGroupe = mutation({
  args: {
    costumeId: v.id("costumes"),
    groupeId: v.id("groupes_choregraphie"),
    parentTableauId: v.id("choregraphies"),
  },
  handler: async (ctx, { costumeId, groupeId, parentTableauId }) => {
    const costume = await ctx.db.get(costumeId);
    if (!costume || typeof costume.quantite !== "number" || costume.quantite <= 0) {
      throw new Error("Costume non disponible");
    }
    const liaisons = await ctx.db
      .query("danseuses_by_groupe")
      .withIndex("by_groupeId", q => q.eq("groupeId", groupeId))
      .collect();
    if (liaisons.length === 0) {
      throw new Error("Aucune danseuse dans ce groupe");
    }
    if (costume.quantite < liaisons.length) {
      throw new Error(`Stock insuffisant : ${costume.quantite} disponible(s) pour ${liaisons.length} danseuse(s)`);
    }
    for (const liaison of liaisons) {
      const assign = await ctx.db
        .query("assignations")
        .withIndex("by_danseuseId_and_choregraphieId", q =>
          q.eq("danseuseId", liaison.danseuseId).eq("choregraphieId", groupeId)
        )
        .filter(q => q.eq(q.field("parentChoregraphieId"), parentTableauId))
        .first();
      if (assign) {
        const ids = assign.costumeIds ?? [];
        if (!ids.includes(costumeId)) {
          await ctx.db.patch(assign._id, { costumeIds: [...ids, costumeId] });
        }
      } else {
        await ctx.db.insert("assignations", {
          danseuseId: liaison.danseuseId,
          parentChoregraphieId: parentTableauId,
          choregraphieId: groupeId,
          costumeIds: [costumeId],
          accessoireIds: [],
        });
      }
    }
    await ctx.db.patch(costumeId, { quantite: costume.quantite - liaisons.length });
    return { success: true, message: `Costume assigné à ${liaisons.length} danseuse(s)`, count: liaisons.length };
  },
});

// Assigner un accessoire a toutes les danseuses d un groupe
export const assignAccessoireToGroupe = mutation({
  args: {
    accessoireId: v.id("accessoires"),
    groupeId: v.id("groupes_choregraphie"),
    parentTableauId: v.id("choregraphies"),
  },
  handler: async (ctx, { accessoireId, groupeId, parentTableauId }) => {
    const accessoire = await ctx.db.get(accessoireId);
    if (!accessoire || typeof accessoire.quantite !== "number" || accessoire.quantite <= 0) {
      throw new Error("Accessoire non disponible");
    }
    const liaisons = await ctx.db
      .query("danseuses_by_groupe")
      .withIndex("by_groupeId", q => q.eq("groupeId", groupeId))
      .collect();
    if (liaisons.length === 0) {
      throw new Error("Aucune danseuse dans ce groupe");
    }
    if (accessoire.quantite < liaisons.length) {
      throw new Error(`Stock insuffisant : ${accessoire.quantite} disponible(s) pour ${liaisons.length} danseuse(s)`);
    }
    for (const liaison of liaisons) {
      const assign = await ctx.db
        .query("assignations")
        .withIndex("by_danseuseId_and_choregraphieId", q =>
          q.eq("danseuseId", liaison.danseuseId).eq("choregraphieId", groupeId)
        )
        .filter(q => q.eq(q.field("parentChoregraphieId"), parentTableauId))
        .first();
      if (assign) {
        const ids = assign.accessoireIds ?? [];
        if (!ids.includes(accessoireId)) {
          await ctx.db.patch(assign._id, { accessoireIds: [...ids, accessoireId] });
        }
      } else {
        await ctx.db.insert("assignations", {
          danseuseId: liaison.danseuseId,
          parentChoregraphieId: parentTableauId,
          choregraphieId: groupeId,
          costumeIds: [],
          accessoireIds: [accessoireId],
        });
      }
    }
    await ctx.db.patch(accessoireId, { quantite: accessoire.quantite - liaisons.length });
    return { success: true, message: `Accessoire assigné à ${liaisons.length} danseuse(s)`, count: liaisons.length };
  },
});

// Assigner une danseuse a un groupe
export const assignDanseuseToGroupe = mutation({
  args: {
    danseuseId: v.id("danseuses"),
    groupeId: v.id("groupes_choregraphie"),
    parentTableauId: v.id("choregraphies"),
  },
  handler: async (ctx, { danseuseId, groupeId, parentTableauId }) => {
    const existing = await ctx.db
      .query("assignations")
      .withIndex("by_danseuseId_and_choregraphieId", q =>
        q.eq("danseuseId", danseuseId).eq("choregraphieId", groupeId)
      )
      .filter(q => q.eq(q.field("parentChoregraphieId"), parentTableauId))
      .first();
    if (!existing) {
      await ctx.db.insert("assignations", {
        danseuseId,
        parentChoregraphieId: parentTableauId,
        choregraphieId: groupeId,
        costumeIds: [],
        accessoireIds: [],
      });
    }
    return { success: true, message: "Danseuse assignee au groupe" };
  },
});
