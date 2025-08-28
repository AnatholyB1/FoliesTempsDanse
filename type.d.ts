import type {Database} from "@/convex/_generated/dataModel";

// Types complets (retour API)
export type Accessoire = Database["accessoires"]["document"];
export type Costume = Database["costumes"]["document"];
export type Role = Database["roles"]["document"];
export type User = Database["users"]["document"];
export type Saison = Database["saison"]["document"];
export type Tableau = Database["tableaux"]["document"];
export type Choregraphie = Database["choregraphies"]["document"];
export type Danseuse = Database["danseuses"]["document"];
export type ChoregraphieDanseuse =
  Database["choregraphie_danseuse"]["document"];
export type Assignation = Database["assignations"]["document"];
export type GroupeChoregraphie = Database["groupes_choregraphie"]["document"];
export type RoleChoregraphie = Database["roles_choregraphie"]["document"];
export type DanseuseGroupe = Database["danseuses_by_groupe"]["document"];

// Types pour la création (sans _id/_creationTime)
export type CreateAccessoire = Omit<Accessoire, "_id" | "_creationTime">;
export type CreateCostume = Omit<Costume, "_id" | "_creationTime">;
export type CreateRole = Omit<Role, "_id" | "_creationTime">;
export type CreateUser = Omit<User, "_id" | "_creationTime">;
export type CreateSaison = Omit<Saison, "_id" | "_creationTime">;
export type CreateTableau = Omit<Tableau, "_id" | "_creationTime">;
export type CreateChoregraphie = Omit<Choregraphie, "_id" | "_creationTime">;
export type CreateDanseuse = Omit<Danseuse, "_id" | "_creationTime">;
export type CreateChoregraphieDanseuse = Omit<
  ChoregraphieDanseuse,
  "_id" | "_creationTime"
>;
export type CreateAssignation = Omit<Assignation, "_id" | "_creationTime">;

// Types pour la mise à jour (avec _id)
export type UpdateAccessoire = Required<Pick<Accessoire, "_id">> &
  Partial<Omit<Accessoire, "_id">>;
export type UpdateCostume = Required<Pick<Costume, "_id">> &
  Partial<Omit<Costume, "_id">>;
export type UpdateRole = Required<Pick<Role, "_id">> &
  Partial<Omit<Role, "_id">>;
export type UpdateUser = Required<Pick<User, "_id">> &
  Partial<Omit<User, "_id">>;
export type UpdateSaison = Required<Pick<Saison, "_id">> &
  Partial<Omit<Saison, "_id">>;
export type UpdateTableau = Required<Pick<Tableau, "_id">> &
  Partial<Omit<Tableau, "_id">>;
export type UpdateChoregraphie = Required<Pick<Choregraphie, "_id">> &
  Partial<Omit<Choregraphie, "_id">>;
export type UpdateDanseuse = Required<Pick<Danseuse, "_id">> &
  Partial<Omit<Danseuse, "_id">>;
export type UpdateChoregraphieDanseuse = Required<
  Pick<ChoregraphieDanseuse, "_id">
> &
  Partial<Omit<ChoregraphieDanseuse, "_id">>;
export type UpdateAssignation = Required<Pick<Assignation, "_id">> &
  Partial<Omit<Assignation, "_id">>;