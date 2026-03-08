import {mutation, query} from "./_generated/server";
import {v} from "convex/values";
import {Doc, Id} from "./_generated/dataModel";
import {Accessoire, Costume} from "../type";

// Récupère tous les utilisateurs avec leur rôle et assignations si danseuse
export const getUsers = query({
    args: {},
    handler: async (ctx) => {
        const users = await ctx.db.query("users").collect();
        return await Promise.all(
            users.map(async (user) => {
                let assignations: unknown = [];
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
        //  .unique();s
        const user = await ctx.db
            .query("users")
            .withIndex("by_token", (q) =>
                q.eq("tokenIdentifier", identity.tokenIdentifier)
            )
            .unique();
        if (user !== null) {
            // If we've seen this identity before but the name has changed, patch the value
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
        const assignations = await ctx.db
            .query("assignations")
            .filter((q) => q.eq(q.field("danseuseId"), danseuse
                ._id))
            .collect();
        const costumes = await Promise.all(
            assignations.flatMap((assignation) =>
                (assignation.costumeIds || []).map((costumeId) =>
                    ctx.db.get(costumeId)
                )
            )
        );
        const accessoires = await Promise.all(
            assignations.flatMap((assignation) =>
                (assignation.accessoireIds || []).map((accessoireId) =>
                    ctx.db.get(accessoireId)
                )
            )
        );
        return {...danseuse, user, costumes, accessoires};
    }
});
// récupère les danseuses par saison avec leur score
export const getDanseusesBySaison = query({
        args: {tableauId: v.id("choregraphies")},
        handler: async (ctx, {tableauId}) => {
            const activeSaison = await ctx.db
                .query("saison")
                .filter((q) => q.eq(q.field("active"), true))
                .unique();

            if (!activeSaison) {
                throw new Error("Aucune saison active trouvée");
            }

            const tableau = await ctx.db.get(tableauId);
            if (!tableau) {
                throw new Error("Tableau non trouvé");
            }

            const [roles, groupes] = await Promise.all([
                ctx.db
                    .query("roles_choregraphie")
                    .withIndex("by_choregraphieId", (q) => q.eq("choregraphieId", tableau._id))
                    .collect(),
                ctx.db
                    .query("groupes_choregraphie")
                    .withIndex("by_choregraphieId", (q) => q.eq("choregraphieId", tableau._id))
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

                    // Fonction utilitaire pour vérifier la présence dans un tableau
                    async function checkPresence(tabId: Id<"choregraphies"> | undefined) {
                        if (!tabId) return false;
                        const groupes = await ctx.db
                            .query("groupes_choregraphie")
                            .withIndex("by_choregraphieId", (q) => q.eq("choregraphieId", tabId))
                            .collect();
                        const promises = [
                            ctx.db.query("roles_choregraphie")
                                .withIndex("by_choregraphieId_and_danseuseId", (q) =>
                                    q.eq("choregraphieId", tabId).eq("danseuseId", danseuse._id)
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
                    const prevList = await ctx.db
                    .query("choregraphies")
                    .withIndex("by_tableauId_and_ordre", (q) =>
                        q
                        .eq("tableauId", tableau.tableauId)
                        .lt("ordre", tableau.ordre)
                    )
                    .collect();

                    const previousChore =
                    prevList.sort(
                        (a, b) => (b.ordre ?? Number.NEGATIVE_INFINITY) - (a.ordre ?? Number.NEGATIVE_INFINITY)
                    )[0] ?? null;

                    if (await checkPresence(previousChore?._id)) score += 6;

                    // Courante
                    if (await checkPresence(tableau._id)) score += 6;

                    // Suivante
                    const nextList = await ctx.db
                    .query("choregraphies")
                    .withIndex("by_tableauId_and_ordre", (q) =>
                        q
                        .eq("tableauId", tableau.tableauId)
                        .gt("ordre", tableau.ordre)
                    )
                    .collect();

                    const nextChore =
                    nextList.sort(
                        (a, b) => (a.ordre ?? Number.POSITIVE_INFINITY) - (b.ordre ?? Number.POSITIVE_INFINITY)
                    )[0] ?? null;
                    if (await checkPresence(nextChore?._id)) score += 6;

                    const assignation = await ctx.db
                        .query("assignations")
                        .withIndex("by_parentChoregraphieId_danseuseId", (q) =>
                            q.eq("danseuseId", danseuse._id).eq("parentChoregraphieId", tableauId as Id<"choregraphies">)
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

export const getRoleByCurrentUser = query({
        args: {},
        handler: async (ctx) => {
            const identity = await ctx.auth.getUserIdentity();
            if (!identity) {
                throw new Error("Called getRoleByCurrentUser without authentication present");
            }
            const user = await ctx.db
                .query("users")
                .withIndex("by_token", (q) =>
                    q.eq("tokenIdentifier", identity.tokenIdentifier)
                )
                .unique();
            if (!user) {
                throw new Error("User not found");
            }
            if (!user.role) {
                throw new Error("User has no role assigned");
            }
            const role = await ctx.db.get(user.role as Id<"roles">);
            if (!role) {
                throw new Error("Role not found");
            }
            return role;
        },
    }
);

export const myStats = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return { status: "signed_out" as const };

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();
    if (!user) return { status: "no_user" as const };

    // Saison active + danseuse liée à ce user (priorité à la saison active)
    const saisons = await ctx.db.query("saison").collect();
    const saisonActive = saisons.find((s) => s.active) ?? saisons[0] ?? null;

    const danseuses = await ctx.db
      .query("danseuses")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect();
    if (danseuses.length === 0) return { status: "no_danseuse" as const };

    const danseuse =
      (saisonActive && danseuses.find((d) => d.saisonId === saisonActive._id)) ??
      danseuses[0];

    // Assignations de cette danseuse
    const assignations = await ctx.db
      .query("assignations")
      .withIndex("by_danseuseId", (q) => q.eq("danseuseId", danseuse._id))
      .collect();

    // Liaisons via groupes (danseuses_by_groupe → groupes_choregraphie)
    const groupeLiaisons = await ctx.db
      .query("danseuses_by_groupe")
      .withIndex("by_danseuseId", (q) => q.eq("danseuseId", danseuse._id))
      .collect();
    const groupeDocs = (await Promise.all(
      groupeLiaisons.map((l) => ctx.db.get(l.groupeId))
    )).filter(Boolean) as Doc<"groupes_choregraphie">[];

    if (assignations.length === 0 && groupeLiaisons.length === 0) {
      return {
        status: "ok" as const,
        saison: saisonActive ? { _id: saisonActive._id, nom: saisonActive.nom, annee: saisonActive.annee } : null,
        danseuse: { _id: danseuse._id, nom: danseuse.nom },
        tableaux: [] as { _id: Id<"choregraphies">; nom: string; ordre: number | undefined; duree: number | undefined; blocId: Id<"tableaux"> | null; blocNom: string; costumes: Doc<"costumes">[]; accessoires: Doc<"accessoires">[] }[],
        stats: {
          chorees: 0,
          costumesUniques: 0,
          accessoiresUniques: 0,
          dureeTotaleSeconds: 0,
          tempsMoyenEntrePassagesSeconds: null as number | null,
          choreesParTableau: [] as { blocId: Id<"tableaux"> | null; blocNom: string; count: number }[],
        },
      };
    }

    // Parents tableaux via assignations
    const parentIdsFromAssignations = new Set(
      assignations
        .map((a) => a.parentChoregraphieId)
        .filter((id): id is Id<"choregraphies"> => !!id)
    );

    // Parents tableaux via groupes (already fetched above)
    const parentIdsFromGroupes = new Set(
      groupeDocs.map((g) => g.choregraphieId)
    );

    // Merge both sources (deduplicated)
    const parentIds = Array.from(new Set([...parentIdsFromAssignations, ...parentIdsFromGroupes]));
    const parentDocs = await Promise.all(parentIds.map((id) => ctx.db.get(id)));
    const parents = parentDocs.filter(Boolean) as Doc<"choregraphies">[];

    // Blocs des parents
    const blocIds = Array.from(
      new Set(parents.map((p) => p.tableauId).filter(Boolean) as Id<"tableaux">[])
    );
    const blocDocs = await Promise.all(blocIds.map((id) => ctx.db.get(id)));
    const blocById = new Map(blocDocs.filter(Boolean).map((t) => [t!._id, t!]));

    // Counts basiques
    const chorees = parents.length;
    const dureeTotaleSeconds = parents.reduce((acc, p) => acc + (p.duree ?? 0), 0);

    const costumesUniques = Array.from(
      new Set(assignations.flatMap((a) => a.costumeIds ?? []).map((id) => id.toString()))
    ).length;

    const accessoiresUniques = Array.from(
      new Set(assignations.flatMap((a) => a.accessoireIds ?? []).map((id) => id.toString()))
    ).length;

    // Tableaux par bloc (sur mes parents)
    const countByBloc = new Map<string, { blocId: Id<"tableaux"> | null; blocNom: string; count: number }>();
    for (const p of parents) {
      const key = p.tableauId ? p.tableauId.toString() : "no_bloc";
      const entry =
        countByBloc.get(key) ??
        {
          blocId: p.tableauId ?? null,
          blocNom: p.tableauId ? blocById.get(p.tableauId)?.nom ?? "Bloc" : "Sans bloc",
          count: 0,
        };
      entry.count += 1;
      countByBloc.set(key, entry);
    }
    const choreesParTableau = Array.from(countByBloc.values()).sort((a, b) =>
      a.blocNom.localeCompare(b.blocNom)
    );

    // Actual tableau details with costumes & accessoires per tableau
    const tableauxDetails = await Promise.all(
      parents
        .sort((a, b) => {
          const bA = a.tableauId ? blocById.get(a.tableauId)?.nom ?? "" : "";
          const bB = b.tableauId ? blocById.get(b.tableauId)?.nom ?? "" : "";
          return bA.localeCompare(bB) || (a.ordre ?? 0) - (b.ordre ?? 0);
        })
        .map(async (p) => {
          const asgns = assignations.filter((a) => a.parentChoregraphieId === p._id);
          const costumeIds = Array.from(
            new Set(asgns.flatMap((a) => a.costumeIds ?? []).map((id) => id.toString()))
          );
          const accessoireIds = Array.from(
            new Set(asgns.flatMap((a) => a.accessoireIds ?? []).map((id) => id.toString()))
          );
          const [costumes, accessoires] = await Promise.all([
            Promise.all(costumeIds.map((id) => ctx.db.get(id as Id<"costumes">))),
            Promise.all(accessoireIds.map((id) => ctx.db.get(id as Id<"accessoires">))),
          ]);
          return {
            _id: p._id,
            nom: p.nom,
            ordre: p.ordre,
            duree: p.duree,
            blocId: p.tableauId ?? null,
            blocNom: p.tableauId ? blocById.get(p.tableauId)?.nom ?? "Bloc" : "Sans bloc",
            costumes: costumes.filter(Boolean) as Doc<"costumes">[],
            accessoires: accessoires.filter(Boolean) as Doc<"accessoires">[],
          };
        })
    );

    // Temps moyen entre deux passages (calculé par tableau, via les durées des chorées intermédiaires)
    // Étapes:
    // - pour chaque tableau impliqué: récupérer toutes les chorégraphies du tableau (durée + ordre)
    // - trier par ordre
    // - lister mes chorégraphies (parents) dans ce tableau, trier par ordre
    // - pour chaque paire consécutive: sommer la durée des chorégraphies dont l'ordre est strictement entre les deux
    // - collecter tous les gaps et faire une moyenne globale
    const gapDurations: number[] = [];

    for (const bid of blocIds) {
      const allInBloc = await ctx.db
        .query("choregraphies")
        .withIndex("by_tableauId", (q) => q.eq("tableauId", bid))
        .collect();

      const allSorted = allInBloc
        .filter((c) => typeof c.ordre === "number")
        .sort((a, b) => (a.ordre ?? 0) - (b.ordre ?? 0));

      const myInBloc = parents
        .filter((p) => p.tableauId && p.tableauId === bid && typeof p.ordre === "number")
        .sort((a, b) => (a.ordre ?? 0) - (b.ordre ?? 0));

      if (myInBloc.length < 2) continue;

      // Pré-calcul: cumul des durées entre positions pour accélérer (optionnel vu les tailles)
      // Ici: simple somme entre deux ordres
      for (let i = 0; i < myInBloc.length - 1; i++) {
        const o1 = myInBloc[i].ordre as number;
        const o2 = myInBloc[i + 1].ordre as number;

        if (o2 <= o1) continue;

        const between = allSorted.filter((c) => (c.ordre as number) > o1 && (c.ordre as number) < o2);
        const gap = between.reduce((acc, c) => acc + (c.duree ?? 0), 0);
        gapDurations.push(gap);
      }
    }

    const tempsMoyenEntrePassagesSeconds =
      gapDurations.length > 0
        ? Math.round(gapDurations.reduce((a, b) => a + b, 0) / gapDurations.length)
        : null;

    return {
      status: "ok" as const,
      saison: saisonActive ? { _id: saisonActive._id, nom: saisonActive.nom, annee: saisonActive.annee } : null,
      danseuse: { _id: danseuse._id, nom: danseuse.nom },
      tableaux: tableauxDetails,
      stats: {
        chorees,
        costumesUniques,
        accessoiresUniques,
        dureeTotaleSeconds,
        tempsMoyenEntrePassagesSeconds,
        choreesParTableau,
      },
    };
  },
});


