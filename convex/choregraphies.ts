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
    return await ctx.db.insert("choregraphies", {...args, ordre});
  },
});

// READ (get one)
export const getChoregraphie = query({
  args: {id: v.id("choregraphies")},
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
  args: {tableauId: v.id("tableaux")},
  handler: async (ctx, {tableauId}) => {
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
  args: {tableauId: v.id("tableaux")},
  handler: async (ctx, {tableauId}) => {
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
  handler: async (ctx, {id, data}) => {
    await ctx.db.patch(id, data);
    return await ctx.db.get(id);
  },
});

// DELETE
export const deleteChoregraphie = mutation({
  args: {id: v.id("choregraphies")},
  handler: async (ctx, {id}) => {
    await ctx.db.delete(id);
    return id;
  },
});

// LIER à un tableau
export const lierATableau = mutation({
  args: {id: v.id("choregraphies"), tableauId: v.id("tableaux")},
  handler: async (ctx, {id, tableauId}) => {
    // On place à la fin
    const count = await ctx.db
      .query("choregraphies")
      .withIndex("by_tableauId", (q) => q.eq("tableauId", tableauId))
      .collect();
    await ctx.db.patch(id, {tableauId, ordre: count.length});
    return await ctx.db.get(id);
  },
});

// DÉTACHER d’un tableau
export const detacherDeTableau = mutation({
  args: {id: v.id("choregraphies")},
  handler: async (ctx, {id}) => {
    await ctx.db.patch(id, {tableauId: undefined, ordre: undefined});
    return id;
  },
});

// RÉORDONNER dans un tableau
export const reorderInTableau = mutation({
  args: {
    order: v.array(v.id("choregraphies")),
  },
  handler: async (ctx, {order}) => {
    // On met à jour l’ordre de chaque chorégraphie
    for (let i = 0; i < order.length; i++) {
      await ctx.db.patch(order[i], {ordre: i});
    }
    return true;
  },
});


export const getRolesByChoregraphie = query({
  args: {choregraphieId: v.id("choregraphies")},
  handler: async (ctx, {choregraphieId}) => {
    return await ctx.db
      .query("roles_choregraphie")
      .withIndex("by_choregraphieId", (q) => q.eq("choregraphieId", choregraphieId))
      .collect();
  },
});

export const getGroupesByChoregraphie = query({
  args: {choregraphieId: v.id("choregraphies")},
  handler: async (ctx, {choregraphieId}) => {
    return await ctx.db
      .query("groupes_choregraphie")
      .withIndex("by_choregraphieId", (q) => q.eq("choregraphieId", choregraphieId))
      .collect();
  }
});


export const assignDanseuseToRole = mutation({
  args: {
    roleId: v.id("roles_choregraphie"),
    danseuseId: v.id("danseuses"),
  },
  handler: async (ctx, {roleId, danseuseId}) => {
    const role = await ctx.db.get(roleId);
    if (!role) throw new Error("Rôle inexistant");
    const danseuse = await ctx.db.get(danseuseId);
    if (!danseuse) throw new Error("Danseuse inexistante");
    await ctx.db.patch(roleId, {danseuseId});
    return {success: true, message: "Danseuse assignée au rôle"};
  },
});

// Retirer une danseuse d’un rôle
export const removeDanseuseFromRole = mutation({
  args: {
    roleId: v.id("roles_choregraphie"),
  },
  handler: async (ctx, {roleId}) => {
    const role = await ctx.db.get(roleId);
    if (!role) throw new Error("Rôle inexistant");
    await ctx.db.patch(roleId, {danseuseId: undefined});
    return {success: true, message: "Danseuse retirée du rôle"};
  },
});

// Assigner une danseuse à un groupe (ajout dans la table de liaison)
export const assignDanseuseToGroupe = mutation({
  args: {
    groupeId: v.id("groupes_choregraphie"),
    danseuseId: v.id("danseuses"),
  },
  handler: async (ctx, {groupeId, danseuseId}) => {
    // Vérifie si la liaison existe déjà
    const exist = await ctx.db
      .query("danseuses_by_groupe")
      .withIndex("by_groupeId_and_danseuseId", q =>
        q.eq("groupeId", groupeId).eq("danseuseId", danseuseId)
      )
      .unique();
    if (exist) {
      return {success: false, message: "Déjà dans le groupe"};
    }
    await ctx.db.insert("danseuses_by_groupe", {groupeId, danseuseId});
    return {success: true, message: "Danseuse ajoutée au groupe"};
  },
});

// Retirer une danseuse d’un groupe (suppression dans la table de liaison)
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
      throw new Error("Danseuse non présente dans le groupe");
    }
    await ctx.db.delete(liaison._id);
    return {success: true, message: "Danseuse retirée du groupe"};
  },
});

export const getPreviousChoregraphie = query({
    args: {tableauId: v.id("tableaux"), ordre: v.number()},
    handler: async (ctx, {tableauId, ordre}) => {
      return await ctx.db
        .query("choregraphies")
        .withIndex("by_tableauId_and_ordre", (q) =>
          q.eq("tableauId", tableauId).lt("ordre", ordre)
        )
        .order("desc")
        .first();
    },
  }
);


export const getNextChoregraphie = query({
    args: {tableauId: v.id("tableaux"), ordre: v.number()},
    handler: async (ctx, {tableauId, ordre}) => {
      return await ctx.db
        .query("choregraphies")
        .withIndex("by_tableauId_and_ordre", (q) =>
          q.eq("tableauId", tableauId).gt("ordre", ordre)
        )
        .order("asc")
        .first();
    },
  }
);
