import type {Database} from "@/convex/_generated/dataModel";


// Type complet (retour API)
export type Accessoire = Database["accessoires"]["document"];
export type Costume = Database["costumes"]["document"];

// Type pour la création (sans _id/_creationTime)
export type CreateAccessoire = Omit<Accessoire, "_id" | "_creationTime">;
export type CreateCostume = Omit<Costume, "_id" | "_creationTime">;