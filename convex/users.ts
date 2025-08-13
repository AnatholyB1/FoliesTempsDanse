import { query } from "./_generated/server";
import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Récupère tous les utilisateurs avec leur rôle et assignations si danseuse
export const getUsers = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    const usersWithAssignations = await Promise.all(
      users.map(async (user) => {
        let assignations: any[] = [];
        const danseuse = await ctx.db
          .query("danseuses")
          .filter((q) => q.eq(q.field("userId"), user._id))
          .unique();
        if (danseuse) {
          assignations = await ctx.db
            .query("assignations")
            .filter((q) => q.eq(q.field("danseuseId"), danseuse._id))
            .collect();
        }
        return { ...user, danseuse, assignations };
      })
    );
    return usersWithAssignations;
  },
});
// Mutation pour assigner un rôle à un utilisateur
export const assignRole = mutation({
  args: { userId: v.id("users"), roleId: v.id("roles") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, { role: args.roleId });
    return true;
  },
});

export const setDanseuse = mutation({
  args: {
    userId: v.id("users"),
    checked: v.boolean(),
    infos: v.string(),
    nom: v.string(),
    saisonId: v.id("saison"),
  },
  handler: async (ctx, { userId, checked, infos, nom, saisonId }) => {
    try {
      // Cherche la danseuse liée à l'utilisateur
      const danseuse = await ctx.db
        .query("danseuses")
        .filter((q) => q.eq(q.field("userId"), userId))
        .unique();

      if (checked) {
        // Crée la danseuse si elle n'existe pas
        if (!danseuse) {
          console.log("Création de la danseuse");
          await ctx.db.insert("danseuses", { userId, infos, nom, saisonId });
        }
        console.log("Mise à jour de la danseuse");
      } else {
        // Supprime la danseuse si elle existe
        console.log("Suppression de la danseuse");
        if (danseuse) {
          console.log("Suppression de la danseuse et elle existe");
          await ctx.db.delete(danseuse._id);
        }
      }
      return true;
    } catch (error) {
      throw new Error("Erreur lors de la création de la danseuse");
    }
  },
});

export const store = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called storeUser without authentication present");
    }

    // Check if we've already stored this identity before.
    // Note: If you don't want to define an index right away, you can use
    // ctx.db.query("users")
    //  .filter(q => q.eq(q.field("tokenIdentifier"), identity.tokenIdentifier))
    //  .unique();
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();
    if (user !== null) {
      // If we've seen this identity before but the name has changed, patch the value.

      await ctx.db.patch(user._id, {
        name: identity.name,
        tokenIdentifier: identity.tokenIdentifier,
        email: identity.preferredUsername,
        picture:
          typeof typeof identity.picture !== "undefined"
            ? JSON.stringify(identity.picture)
            : undefined,
        nickname: identity.nickname,
        given_name: identity.givenName,
        updated_at: new Date().toISOString(),
        family_name: identity.familyName,
        phone_number:
          typeof identity.phone_number !== "undefined"
            ? JSON.stringify(identity.phone_number)
            : undefined,
        email_verified:
          typeof identity.email_verified !== "undefined"
            ? Boolean(identity.email_verified)
            : false,
        phone_number_verified:
          typeof identity.phone_number_verified !== "undefined"
            ? Boolean(identity.phone_number_verified)
            : false,
      });

      return user._id;
    }

    const roleUserID = process.env.ROLE_ID;

    if (!roleUserID) {
      throw new Error("ADMIN_ID environment variable is not set");
    }

    const roleId = roleUserID as Id<"roles">;

    // If it's a new identity, create a new `User`.
    return await ctx.db.insert("users", {
      name: identity.name,
      tokenIdentifier: identity.tokenIdentifier,
      role: roleId,
      email: identity.preferredUsername,
      picture:
        typeof typeof identity.picture !== "undefined"
          ? JSON.stringify(identity.picture)
          : undefined,
      nickname: identity.nickname,
      given_name: identity.givenName,
      updated_at: new Date().toISOString(),
      family_name: identity.familyName,
      phone_number:
        typeof identity.phone_number !== "undefined"
          ? JSON.stringify(identity.phone_number)
          : undefined,
      email_verified:
        typeof identity.email_verified !== "undefined"
          ? Boolean(identity.email_verified)
          : false,
      phone_number_verified:
        typeof identity.phone_number_verified !== "undefined"
          ? Boolean(identity.phone_number_verified)
          : false,
    });
  },
});
