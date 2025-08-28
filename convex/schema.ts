import {defineSchema, defineTable} from "convex/server";
import {v} from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.optional(v.string()),
    tokenIdentifier: v.string(),
    email: v.optional(v.string()),
    picture: v.optional(v.string()),
    nickname: v.optional(v.string()),
    given_name: v.optional(v.string()),
    updated_at: v.optional(v.string()),
    family_name: v.optional(v.string()),
    phone_number: v.optional(v.string()),
    email_verified: v.optional(v.boolean()),
    phone_number_verified: v.optional(v.boolean()),
    role: v.id("roles"),
  }).index("by_token", ["tokenIdentifier"]),

  roles: defineTable({
    role: v.string(),
  }),

  costumes: defineTable({
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
    photo_prise_par: v.optional(v.string()),
  }).index("by_quantite", ["quantite"]),

  accessoires: defineTable({
    photo: v.optional(v.string()),
    descriptif: v.optional(v.string()),
    sexe: v.optional(v.string()),
    type: v.optional(v.string()),
    tissu_motif: v.optional(v.string()),
    couleur: v.optional(v.string()),
    taille: v.optional(v.union(v.number(), v.string())),
    quantite: v.optional(v.number()),
    divers: v.optional(v.string()),
    portant: v.optional(v.number()),
    photo_prise_par: v.optional(v.string()),
  }).index("by_quantite", ["quantite"]),

  saison: defineTable({
    nom: v.string(),
    annee: v.string(),
    description: v.optional(v.string()),
    active: v.optional(v.boolean()),
  }),

  tableaux: defineTable({
    nom: v.string(),
    saisonId: v.id("saison"),
    description: v.optional(v.string()),
  }).index("by_saisonId", ["saisonId"]),

  choregraphies: defineTable({
    nom: v.string(),
    tableauId: v.optional(v.id("tableaux")),
    musique: v.optional(v.string()),
    ordre: v.optional(v.number()),
    duree: v.optional(v.number()),
    description: v.optional(v.string()),
  }).index("by_tableauId", ["tableauId"]).index("by_tableauId_and_ordre", ["tableauId", "ordre"]),

  danseuses: defineTable({
    nom: v.string(),
    infos: v.optional(v.string()),
    saisonId: v.id("saison"),
    userId: v.optional(v.id("users")),
  }).index("by_saisonId", ["saisonId"]).index("by_userId", ["userId"]),

  assignations: defineTable({
    danseuseId: v.id("danseuses"),
    parentChoregraphieId: v.id("choregraphies"),
    choregraphieId: v.union(v.id("roles_choregraphie"), v.id("groupes_choregraphie")),
    costumeIds: v.optional(v.array(v.id("costumes"))),
    accessoireIds: v.optional(v.array(v.id("accessoires"))),
  })
    .index("by_danseuseId_and_choregraphieId", ["danseuseId", "choregraphieId"])
    .index("by_choregraphieId", ["choregraphieId"])
    .index("by_danseuseId", ["danseuseId"])
    .index("by_parentChoregraphieId", ["parentChoregraphieId"])
    .index("by_parentChoregraphieId_danseuseId", [ "danseuseId", "parentChoregraphieId"]),



  roles_choregraphie: defineTable({
    choregraphieId: v.id("choregraphies"),
    nom: v.string(),
    danseuseId: v.optional(v.id("danseuses")),
  }).index("by_choregraphieId", ["choregraphieId"])
    .index("by_danseuseId", ["danseuseId"])
    .index("by_choregraphieId_and_danseuseId", ["choregraphieId", "danseuseId"]),

  groupes_choregraphie: defineTable({
    choregraphieId: v.id("choregraphies"),
    nom: v.string(),
  }).index("by_choregraphieId", ["choregraphieId"]),

  danseuses_by_groupe: defineTable({
    groupeId: v.id("groupes_choregraphie"),
    danseuseId: v.id("danseuses"),
  }).index("by_groupeId", ["groupeId"])
    .index("by_danseuseId", ["danseuseId"])
    .index("by_groupeId_and_danseuseId", ["groupeId", "danseuseId"])

});
