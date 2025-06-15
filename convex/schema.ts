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
    taille: v.optional(v.string()),
    quantite: v.optional(v.string()),
    emplacement: v.optional(v.string()),
    portant: v.optional(v.string()),
    photo_prise_par: v.optional(v.string()),
  }),

  accesoires: defineTable({
    photo: v.optional(v.string()),
    descriptif: v.optional(v.string()),
    sexe: v.optional(v.string()),
    type: v.optional(v.string()),
    tissu_motif: v.optional(v.string()),
    couleur: v.optional(v.string()),
    taille: v.optional(v.string()),
    quantite: v.optional(v.string()),
    divers: v.optional(v.string()),
    portant: v.optional(v.string()),
    photo_prise_par: v.optional(v.string()),
  }),
});
