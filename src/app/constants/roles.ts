// ~/constants/roles.ts
export const ROLE_MAP = {
  USER: "cmn08awhm0006c0u9oqx1b6kq",
  HANDLER: "cmn08awha0005c0u9u1bhwcnz",
} as const;

export type RoleKey = keyof typeof ROLE_MAP;
