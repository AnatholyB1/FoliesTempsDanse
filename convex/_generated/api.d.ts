/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as accessoires from "../accessoires.js";
import type * as assignation from "../assignation.js";
import type * as choregraphies from "../choregraphies.js";
import type * as costumes from "../costumes.js";
import type * as file from "../file.js";
import type * as groupes from "../groupes.js";
import type * as roles from "../roles.js";
import type * as saisons from "../saisons.js";
import type * as tableaux from "../tableaux.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  accessoires: typeof accessoires;
  assignation: typeof assignation;
  choregraphies: typeof choregraphies;
  costumes: typeof costumes;
  file: typeof file;
  groupes: typeof groupes;
  roles: typeof roles;
  saisons: typeof saisons;
  tableaux: typeof tableaux;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
