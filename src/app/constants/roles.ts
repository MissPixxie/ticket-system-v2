// ~/constants/roles.ts
export const ROLE_MAP = {
  USER: "cmo44d83b0006ncu9u6qjizg9",
  HANDLER: "cmo44d8340005ncu9ccp85eve",
} as const;

export type RoleKey = keyof typeof ROLE_MAP;
