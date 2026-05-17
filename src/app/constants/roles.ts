// ~/constants/roles.ts
export const ROLE_MAP = {
  USER: "cmp8sxw7o0006z8u90edckesm",
  HANDLER: "cmp8sxw7f0005z8u9q6f1n3qr",
} as const;

export type RoleKey = keyof typeof ROLE_MAP;
