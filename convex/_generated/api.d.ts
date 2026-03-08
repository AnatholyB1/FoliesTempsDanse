/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as accessoires from "../accessoires.js";
import type * as assignation from "../assignation.js";
import type * as blocs from "../blocs.js";
import type * as costumes from "../costumes.js";
import type * as file from "../file.js";
import type * as groupes from "../groupes.js";
import type * as roles from "../roles.js";
import type * as saisons from "../saisons.js";
import type * as tableaux from "../tableaux.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  accessoires: typeof accessoires;
  assignation: typeof assignation;
  blocs: typeof blocs;
  costumes: typeof costumes;
  file: typeof file;
  groupes: typeof groupes;
  roles: typeof roles;
  saisons: typeof saisons;
  tableaux: typeof tableaux;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
