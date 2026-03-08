import {mutation, query} from "./_generated/server";
import {v} from "convex/values";

// CREATE
export const createTableau = mutation({
  args: {
    nom: v.string(),
    blocId: v.id("tableaux"),
    musique: v.optional(v.string()),
    ordre: v.optional(v.number()),
    duree: v.optional(v.number()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { blocId, ...rest } = args;
    let ordre = rest.ordre;
    if (ordre === undefined) {
      const count = await ctx.db
        .query("choregraphies")
        .withIndex("by_tableauId", (q) => q.eq("tableauId", blocId))
        .collect();
      ordre = count.length;
    }
    return await ctx.db.insert("choregraphies", {...rest, tableauId: blocId, ordre});
  },
});

// READ (get one)
export const getTableau = query({
  args: {id: v.id("choregraphies")},
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// READ (get all)
export const getTableaux = query({
  handler: async (ctx) => {
    return await ctx.db.query("choregraphies").collect();
  }
});

// READ (get all for a bloc)
export const getByBloc = query({
  args: {blocId: v.id("tableaux")},
  handler: async (ctx, {blocId}) => {
    return await ctx.db
      .query("choregraphies")
      .withIndex("by_tableauId_and_ordre", (q) =>
        q.eq("tableauId", blocId).gt("ordre", -1)
      )
      .collect();
  },
});

// READ (get all not in bloc)
export const getNotInBloc = query({
  args: {blocId: v.id("tableaux")},
  handler: async (ctx, {blocId}) => {
    return await ctx.db
      .query("choregraphies")
      .filter((q) => q.neq(q.field("tableauId"), blocId))
      .collect();
  },
});

// UPDATE
export const updateTableau = mutation({
  args: {
    id: v.id("choregraphies"),
    data: v.object({
      nom: v.optional(v.string()),
      musique: v.optional(v.string()),
      ordre: v.optional(v.number()),
      duree: v.optional(v.number()),
      description: v.optional(v.string()),
      blocId: v.optional(v.id("tableaux")),
    }),
  },
  handler: async (ctx, {id, data}) => {
    const { blocId, ...rest } = data;
    await ctx.db.patch(id, {...rest, ...(blocId !== undefined ? {tableauId: blocId} : {})});
    return await ctx.db.get(id);
  },
});

// DELETE
export const deleteTableau = mutation({
  args: {id: v.id("choregraphies")},
  handler: async (ctx, {id}) => {
    await ctx.db.delete(id);
    return id;
  },
});

// DUPLICATE
export const duplicateTableau = mutation({
  args: { id: v.id("choregraphies") },
  handler: async (ctx, { id }) => {
    const original = await ctx.db.get(id);
    if (!original) throw new Error("Tableau introuvable");
    const { _id, _creationTime, ...fields } = original;
    const siblings = await ctx.db
      .query("choregraphies")
      .withIndex("by_tableauId", (q) => q.eq("tableauId", fields.tableauId))
      .collect();
    return await ctx.db.insert("choregraphies", {
      ...fields,
      nom: `Copie de ${fields.nom}`,
      ordre: siblings.length,
    });
  },
});

// LIER a un bloc
export const lierABloc = mutation({
  args: {id: v.id("choregraphies"), blocId: v.id("tableaux")},
  handler: async (ctx, {id, blocId}) => {
    const count = await ctx.db
      .query("choregraphies")
      .withIndex("by_tableauId", (q) => q.eq("tableauId", blocId))
      .collect();
    await ctx.db.patch(id, {tableauId: blocId, ordre: count.length});
    return await ctx.db.get(id);
  },
});

// DETACHER d'un bloc
export const detacherDeBloc = mutation({
  args: {id: v.id("choregraphies")},
  handler: async (ctx, {id}) => {
    await ctx.db.patch(id, {tableauId: undefined, ordre: undefined});
    return id;
  },
});

// REORDONNER dans un bloc
export const reorderInBloc = mutation({
  args: {
    order: v.array(v.id("choregraphies")),
  },
  handler: async (ctx, {order}) => {
    for (let i = 0; i < order.length; i++) {
      await ctx.db.patch(order[i], {ordre: i});
    }
    return true;
  },
});

export const getRolesByTableau = query({
  args: {tableauId: v.id("choregraphies")},
  handler: async (ctx, {tableauId}) => {
    return await ctx.db
      .query("roles_choregraphie")
      .withIndex("by_choregraphieId", (q) => q.eq("choregraphieId", tableauId))
      .collect();
  },
});

export const getGroupesByTableau = query({
  args: {tableauId: v.id("choregraphies")},
  handler: async (ctx, {tableauId}) => {
    return await ctx.db
      .query("groupes_choregraphie")
      .withIndex("by_choregraphieId", (q) => q.eq("choregraphieId", tableauId))
      .collect();
  }
});

export const getGroupesWithDanseuses = query({
  args: {tableauId: v.id("choregraphies")},
  handler: async (ctx, {tableauId}) => {
    const groupes = await ctx.db
      .query("groupes_choregraphie")
      .withIndex("by_choregraphieId", (q) => q.eq("choregraphieId", tableauId))
      .collect();
    return await Promise.all(groupes.map(async (groupe) => {
      const liaisons = await ctx.db
        .query("danseuses_by_groupe")
        .withIndex("by_groupeId", (q) => q.eq("groupeId", groupe._id))
        .collect();
      const danseuses = (await Promise.all(liaisons.map((l) => ctx.db.get(l.danseuseId)))).filter(Boolean);
      return {...groupe, danseuses};
    }));
  },
});

export const assignDanseuseToRole = mutation({
  args: {
    roleId: v.id("roles_choregraphie"),
    danseuseId: v.id("danseuses"),
  },
  handler: async (ctx, {roleId, danseuseId}) => {
    const role = await ctx.db.get(roleId);
    if (!role) throw new Error("Role inexistant");
    const danseuse = await ctx.db.get(danseuseId);
    if (!danseuse) throw new Error("Danseuse inexistante");
    await ctx.db.patch(roleId, {danseuseId});
    return {success: true, message: "Danseuse assignee au role"};
  },
});

export const removeDanseuseFromRole = mutation({
  args: {
    roleId: v.id("roles_choregraphie"),
  },
  handler: async (ctx, {roleId}) => {
    const role = await ctx.db.get(roleId);
    if (!role) throw new Error("Role inexistant");
    await ctx.db.patch(roleId, {danseuseId: undefined});
    return {success: true, message: "Danseuse retiree du role"};
  },
});

export const assignDanseuseToGroupe = mutation({
  args: {
    groupeId: v.id("groupes_choregraphie"),
    danseuseId: v.id("danseuses"),
    parentTableauId: v.id("choregraphies"),
  },
  handler: async (ctx, {groupeId, danseuseId, parentTableauId}) => {
    const exist = await ctx.db
      .query("danseuses_by_groupe")
      .withIndex("by_groupeId_and_danseuseId", q =>
        q.eq("groupeId", groupeId).eq("danseuseId", danseuseId)
      )
      .unique();
    if (exist) {
      return {success: false, message: "Deja dans le groupe", skippedEquipment: 0};
    }

    // Find equipment common to all current members for this group
    const existingLiaisons = await ctx.db
      .query("danseuses_by_groupe")
      .withIndex("by_groupeId", q => q.eq("groupeId", groupeId))
      .collect();

    const memberAssigns = await Promise.all(
      existingLiaisons.map(l =>
        ctx.db
          .query("assignations")
          .withIndex("by_danseuseId_and_choregraphieId", q =>
            q.eq("danseuseId", l.danseuseId).eq("choregraphieId", groupeId)
          )
          .filter(q => q.eq(q.field("parentChoregraphieId"), parentTableauId))
          .first()
      )
    );

    // Intersection: IDs present in ALL existing members
    const allCostumeIds = memberAssigns[0]?.costumeIds ?? [];
    const allAccessoireIds = memberAssigns[0]?.accessoireIds ?? [];
    const groupCostumeIds = allCostumeIds.filter(id =>
      memberAssigns.every(a => (a?.costumeIds ?? []).includes(id))
    );
    const groupAccessoireIds = allAccessoireIds.filter(id =>
      memberAssigns.every(a => (a?.accessoireIds ?? []).includes(id))
    );

    // Add danseuse to group
    await ctx.db.insert("danseuses_by_groupe", {groupeId, danseuseId});

    // Copy equipment with stock check
    const copiedCostumes: typeof groupCostumeIds = [];
    const copiedAccessoires: typeof groupAccessoireIds = [];

    for (const costumeId of groupCostumeIds) {
      const costume = await ctx.db.get(costumeId);
      if (costume && typeof costume.quantite === "number" && costume.quantite > 0) {
        copiedCostumes.push(costumeId);
        await ctx.db.patch(costumeId, {quantite: costume.quantite - 1});
      }
    }
    for (const accessoireId of groupAccessoireIds) {
      const acc = await ctx.db.get(accessoireId);
      if (acc && typeof acc.quantite === "number" && acc.quantite > 0) {
        copiedAccessoires.push(accessoireId);
        await ctx.db.patch(accessoireId, {quantite: acc.quantite - 1});
      }
    }

    if (copiedCostumes.length > 0 || copiedAccessoires.length > 0) {
      await ctx.db.insert("assignations", {
        danseuseId,
        parentChoregraphieId: parentTableauId,
        choregraphieId: groupeId,
        costumeIds: copiedCostumes,
        accessoireIds: copiedAccessoires,
      });
    }

    const skippedEquipment =
      (groupCostumeIds.length - copiedCostumes.length) +
      (groupAccessoireIds.length - copiedAccessoires.length);
    return {success: true, message: "Danseuse ajoutee au groupe", skippedEquipment};
  },
});

export const removeDanseuseFromGroupe = mutation({
  args: {
    groupeId: v.id("groupes_choregraphie"),
    danseuseId: v.id("danseuses"),
  },
  handler: async (ctx, {groupeId, danseuseId}) => {
    const liaison = await ctx.db
      .query("danseuses_by_groupe")
      .withIndex("by_groupeId_and_danseuseId", q =>
        q.eq("groupeId", groupeId).eq("danseuseId", danseuseId)
      )
      .unique();
    if (!liaison) {
      throw new Error("Danseuse non presente dans le groupe");
    }
    await ctx.db.delete(liaison._id);
    return {success: true, message: "Danseuse retiree du groupe"};
  },
});

export const getPreviousTableau = query({
    args: {blocId: v.id("tableaux"), ordre: v.number()},
    handler: async (ctx, {blocId, ordre}) => {
      return await ctx.db
        .query("choregraphies")
        .withIndex("by_tableauId_and_ordre", (q) =>
          q.eq("tableauId", blocId).lt("ordre", ordre)
        )
        .order("desc")
        .first();
    },
  }
);

export const getNextTableau = query({
    args: {blocId: v.id("tableaux"), ordre: v.number()},
    handler: async (ctx, {blocId, ordre}) => {
      return await ctx.db
        .query("choregraphies")
        .withIndex("by_tableauId_and_ordre", (q) =>
          q.eq("tableauId", blocId).gt("ordre", ordre)
        )
        .order("asc")
        .first();
    },
  }
);
