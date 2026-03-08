import {mutation, query} from "./_generated/server";
import {v} from "convex/values";
// CREATE
export const createRoleTableau = mutation({
  args: {
    tableauId: v.id("choregraphies"),
    nom: v.string(),
    danseuseId: v.optional(v.id("danseuses")),
  },
  handler: async (ctx, args) => {
    const { tableauId, ...rest } = args;
    return await ctx.db.insert("roles_choregraphie", { choregraphieId: tableauId, ...rest });
  },
});

// READ (un role de tableau)
export const getRoleTableau = query({
  args: { id: v.id("roles_choregraphie") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// READ (tous les roles d un tableau)
export const getRoleTableauByTableau = query({
  args: { tableauId: v.id("choregraphies") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("roles_choregraphie")
      .withIndex("by_choregraphieId", (q) => q.eq("choregraphieId", args.tableauId))
      .collect();
  },
});

// READ (tous les roles d un tableau avec la danseuse embarquée)
export const getRolesWithDanseuses = query({
  args: { tableauId: v.id("choregraphies") },
  handler: async (ctx, { tableauId }) => {
    const roles = await ctx.db
      .query("roles_choregraphie")
      .withIndex("by_choregraphieId", (q) => q.eq("choregraphieId", tableauId))
      .collect();
    return await Promise.all(roles.map(async (role) => {
      if (!role.danseuseId) return {...role, danseuse: undefined};
      const danseuse = await ctx.db.get(role.danseuseId);
      if (!danseuse) return {...role, danseuse: undefined};
      const user = danseuse.userId ? await ctx.db.get(danseuse.userId) : undefined;
      return {...role, danseuse: {...danseuse, user}};
    }));
  },
});

// UPDATE
export const updateRoleTableau = mutation({
  args: {
    id: v.id("roles_choregraphie"),
    nom: v.optional(v.string()),
    danseuseId: v.optional(v.id("danseuses")),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    await ctx.db.patch(id, data);
    return await ctx.db.get(id);
  },
});

// DELETE
export const deleteRoleTableau = mutation({
  args: { id: v.id("roles_choregraphie") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return args.id;
  },
});
