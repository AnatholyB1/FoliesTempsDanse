import {mutation, query} from "./_generated/server";
import {v} from "convex/values";
import {Id} from "./_generated/dataModel";
import {Accessoire, Costume} from "../type";

// Récupère tous les utilisateurs avec leur rôle et assignations si danseuse
export const getUsers = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    return await Promise.all(
      users.map(async (user) => {
        let assignations : unknown = [];
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
        return {...user, danseuse, assignations};
      })
    );
  },
});
// Mutation pour assigner un rôle à un utilisateur
export const assignRole = mutation({
  args: {userId: v.id("users"), roleId: v.id("roles")},
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {role: args.roleId});
    return true;
  },
});

export const getRoles = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("roles").collect();
  }
});


export const setDanseuse = mutation({
  args: {
    userId: v.id("users"),
    checked: v.boolean(),
    infos: v.string(),
    nom: v.string(),
    saisonId: v.id("saison"),
  },
  handler: async (ctx, {userId, checked, infos, nom, saisonId}) => {
    try {
      // Cherche la danseuse liée à l'utilisateur
      const danseuse = await ctx.db
        .query("danseuses")
        .filter((q) => q.eq(q.field("userId"), userId))
        .unique();
      if (checked) {
        // Crée la danseuse si elle n'existe pas
        if (!danseuse) {
          await ctx.db.insert("danseuses", {userId, infos, nom, saisonId});
        }
      } else {
        // Supprime la danseuse si elle existe
        if (danseuse) {
          await ctx.db.delete(danseuse._id);
        }
      }
      return true;
    } catch (error) {
      throw new Error(`Erreur lors de la création de la danseuse  ${error}`);
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
        email: identity.email,
        picture: identity.pictureUrl
          ? JSON.stringify(identity.pictureUrl)
          : undefined,
        nickname: undefined,
        given_name: identity.givenName,
        updated_at: new Date().toISOString(),
        family_name: identity.familyName,
        phone_number: identity.phoneNumber ?
          JSON.stringify(identity.phoneNumber) :
          undefined,
        email_verified:
          typeof identity.emailVerified !== "undefined"
            ? Boolean(identity.emailVerified)
            : false,
        phone_number_verified:
          typeof identity.phoneNumberVerified !== "undefined"
            ? Boolean(identity.phoneNumberVerified)
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
      email: identity.email,
      picture: identity.pictureUrl
        ? JSON.stringify(identity.pictureUrl)
        : undefined,
      nickname: undefined,
      given_name: identity.givenName,
      updated_at: new Date().toISOString(),
      family_name: identity.familyName,
      phone_number: identity.phoneNumber ?
        JSON.stringify(identity.phoneNumber) :
        undefined,
      email_verified:
        typeof identity.emailVerified !== "undefined"
          ? Boolean(identity.emailVerified)
          : false,
      phone_number_verified:
        typeof identity.phoneNumberVerified !== "undefined"
          ? Boolean(identity.phoneNumberVerified)
          : false,
    });
  },
});

// récupérer les danseuses
export const getDanseuses = query({
  args: {},
  handler: async (ctx) => {
    const danseuses = await ctx.db.query("danseuses").collect();
    return await Promise.all(
      danseuses.map(async (danseuse) => {
        const user = await ctx.db.get(danseuse.userId as Id<"users">);
        return {...danseuse, user};
      })
    );
  }
});

export const getDanseuse = query({
  args: {id: v.id("danseuses")},
  handler: async (ctx, {id}) => {
    const danseuse = await ctx.db.get(id);
    if (!danseuse) {
      throw new Error("Danseuse non trouvée");
    }
    const user = await ctx.db.get(danseuse.userId as Id<"users">);
    return {...danseuse, user};
  }
});
// récupère les danseuses par saison avec leur score
export const getDanseusesBySaison = query({
    args: {choreId: v.id("choregraphies")},
    handler: async (ctx, {choreId}) => {
      const activeSaison = await ctx.db
        .query("saison")
        .filter((q) => q.eq(q.field("active"), true))
        .unique();

      if (!activeSaison) {
        throw new Error("Aucune saison active trouvée");
      }

      const choregraphie = await ctx.db.get(choreId);
      if (!choregraphie) {
        throw new Error("Chorégraphie non trouvée");
      }

      const [roles, groupes] = await Promise.all([
        ctx.db
          .query("roles_choregraphie")
          .withIndex("by_choregraphieId", (q) => q.eq("choregraphieId", choregraphie._id))
          .collect(),
        ctx.db
          .query("groupes_choregraphie")
          .withIndex("by_choregraphieId", (q) => q.eq("choregraphieId", choregraphie._id))
          .collect(),
      ]);

      const groupesDanseuses = await Promise.all(
        groupes.map(groupe =>
          ctx.db
            .query("danseuses_by_groupe")
            .withIndex("by_groupeId", (q) => q.eq("groupeId", groupe._id))
            .collect()
        )
      );

      const danseuseIdsInRoles = roles.map(r => r.danseuseId).filter(Boolean);
      const danseuseIdsInGroupes = groupesDanseuses.flat().map(g => g.danseuseId);
      const assignedDanseuseIds = new Set([
        ...danseuseIdsInRoles,
        ...danseuseIdsInGroupes,
      ]);

      const danseuses = await ctx.db
        .query("danseuses")
        .withIndex("by_saisonId", (q) => q.eq("saisonId", activeSaison._id))
        .collect();


      const danseusesDisponibles = danseuses.filter(
        d => !assignedDanseuseIds.has(d._id)
      );

      if (danseuses.length === 0) {
        return []
      }

      // calculer le score pour chaque danseuse
      const danseusesWithScores = await Promise.all(
        danseusesDisponibles.map(async (danseuse) => {
          const user = await ctx.db.get(danseuse.userId as Id<"users">);
          let score = 0;

          // Fonction utilitaire pour vérifier la présence dans une chorégraphie
          async function checkPresence(choreId: Id<"choregraphies"> | undefined) {
            if (!choreId) return false;
            const groupes = await ctx.db
              .query("groupes_choregraphie")
              .withIndex("by_choregraphieId", (q) => q.eq("choregraphieId", choreId))
              .collect();
            const promises = [
              ctx.db.query("roles_choregraphie")
                .withIndex("by_choregraphieId_and_danseuseId", (q) =>
                  q.eq("choregraphieId", choreId).eq("danseuseId", danseuse._id)
                )
                .unique(),
              ...groupes.map((groupe) =>
                ctx.db.query("danseuses_by_groupe")
                  .withIndex("by_groupeId_and_danseuseId", (q) =>
                    q.eq("groupeId", groupe._id).eq("danseuseId", danseuse._id)
                  )
                  .unique()
              ),
            ];
            const [role, ...groupResults] = await Promise.all(promises);
            return !!role || groupResults.some(Boolean);
          }

          // Précédente
          const previousChore = await ctx.db
            .query("choregraphies")
            .withIndex("by_tableauId_and_ordre", (q) => q.eq("tableauId", choregraphie.tableauId).lt("ordre", choregraphie.ordre))
            .unique();
          if (await checkPresence(previousChore?._id)) score += 6;

          // Courante
          if (await checkPresence(choregraphie._id)) score += 6;

          // Suivante
          const nextChore = await ctx.db
            .query("choregraphies")
            .withIndex("by_tableauId_and_ordre", (q) => q.eq("tableauId", choregraphie.tableauId).gt("ordre", choregraphie.ordre))
            .unique();
          if (await checkPresence(nextChore?._id)) score += 6;

          const assignation = await ctx.db
            .query("assignations")
            .withIndex("by_parentChoregraphieId_danseuseId", (q) =>
              q.eq("danseuseId", danseuse._id).eq("parentChoregraphieId", choreId as Id<"choregraphies">)
            )
            .unique();

          let costumes: Costume[] = [];
          let accessoires: Accessoire[] = [];
          if (assignation) {
            if (assignation.costumeIds && assignation.costumeIds.length > 0) {
              costumes = await Promise.all(
                assignation.costumeIds.map((id) => ctx.db.get(id))
              );
            }
            if (assignation.accessoireIds && assignation.accessoireIds.length > 0) {
              accessoires = await Promise.all(
                assignation.accessoireIds.map((id) => ctx.db.get(id))
              );
            }
          }


          return {
            ...danseuse,
            user,
            score,
            assignation: assignation
              ? {
                costumes: costumes.filter(Boolean),
                accessoires: accessoires.filter(Boolean),
              }
              : null,
          };
        })
      );


      return danseusesWithScores.sort((a, b) => b.score - a.score)
    }
  }
);



