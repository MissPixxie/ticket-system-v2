import { Prisma } from "@prisma/client";
import { db } from "~/server/db";

export async function createAuditLog(data: Prisma.AuditLogCreateInput) {
  return db.auditLog.create({
    data,
  });
}
