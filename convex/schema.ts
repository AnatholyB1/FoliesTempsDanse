import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

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
    quantite: v.optional(v.union(v.number(), v.string())),
    emplacement: v.optional(v.string()),
    portant: v.optional(v.number()),
    photo_prise_par: v.optional(v.string()),
  }),

  accessoires: defineTable({
    photo: v.optional(v.string()),
    descriptif: v.optional(v.string()),
    sexe: v.optional(v.string()),
    type: v.optional(v.string()),
    tissu_motif: v.optional(v.string()),
    couleur: v.optional(v.string()),
    taille: v.optional(v.union(v.number(), v.string())),
    quantite: v.optional(v.union(v.number(), v.string())),
    divers: v.optional(v.string()),
    portant: v.optional(v.number()),
    photo_prise_par: v.optional(v.string()),
  }),

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
  }),

  choregraphies: defineTable({
    nom: v.string(),
    tableauId: v.id("tableaux"),
    musique: v.optional(v.string()),
    ordre: v.optional(v.number()),
    duree: v.optional(v.number()),
    description: v.optional(v.string()),
  }),

  danseuses: defineTable({
    nom: v.string(),
    infos: v.optional(v.string()),
    saisonId: v.id("saison"),
    userId: v.optional(v.id("users")),
  }),

  choregraphie_danseuse: defineTable({
    choregraphieId: v.id("choregraphies"),
    danseuseId: v.id("danseuses"),
  }),

  assignations: defineTable({
    danseuseId: v.id("danseuses"),
    choregraphieId: v.id("choregraphies"),
    costumeIds: v.optional(v.array(v.id("costumes"))),
    accessoireIds: v.optional(v.array(v.id("accessoires"))),
  }),
});
