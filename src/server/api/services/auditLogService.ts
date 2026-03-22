import { Prisma } from "@prisma/client";
import { db } from "~/server/db";

export async function createAuditLog(data: Prisma.AuditLogCreateInput) {
  return db.auditLog.create({
    data,
  });
}

export function logAuditAsync(logData: Parameters<typeof createAuditLog>[0]) {
  (async () => {
    try {
      await createAuditLog(logData);
    } catch (err) {
      console.error("Audit log error:", err);
    }
  })();
}
