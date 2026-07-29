/*
  Warnings:

  - You are about to drop the column `image` on the `Ticket` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Ticket" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "issue" TEXT NOT NULL,
    "imagePublicId" TEXT,
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "department" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "priority" TEXT NOT NULL DEFAULT 'LOW',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "solvedAt" DATETIME,
    "createdById" TEXT,
    "assignedToId" TEXT,
    "embedding" TEXT,
    "conversationId" TEXT,
    "signedByUser" BOOLEAN NOT NULL DEFAULT false,
    "signedByHandler" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Ticket_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Ticket_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Ticket_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Ticket" ("assignedToId", "conversationId", "createdAt", "createdById", "department", "embedding", "id", "isAnonymous", "issue", "priority", "signedByHandler", "signedByUser", "solvedAt", "status", "title", "updatedAt") SELECT "assignedToId", "conversationId", "createdAt", "createdById", "department", "embedding", "id", "isAnonymous", "issue", "priority", "signedByHandler", "signedByUser", "solvedAt", "status", "title", "updatedAt" FROM "Ticket";
DROP TABLE "Ticket";
ALTER TABLE "new_Ticket" RENAME TO "Ticket";
CREATE UNIQUE INDEX "Ticket_conversationId_key" ON "Ticket"("conversationId");
CREATE INDEX "Ticket_createdById_idx" ON "Ticket"("createdById");
CREATE INDEX "Ticket_assignedToId_idx" ON "Ticket"("assignedToId");
CREATE INDEX "Ticket_status_idx" ON "Ticket"("status");
CREATE INDEX "Ticket_department_idx" ON "Ticket"("department");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
