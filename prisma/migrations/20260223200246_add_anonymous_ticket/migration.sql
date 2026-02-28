-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Ticket" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "issue" TEXT NOT NULL,
    "image" TEXT,
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "department" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "priority" TEXT NOT NULL DEFAULT 'LOW',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "solvedAt" DATETIME,
    "createdById" TEXT NOT NULL,
    "assignedToId" TEXT,
    "userId" TEXT,
    CONSTRAINT "Ticket_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Ticket_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Ticket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Ticket" ("assignedToId", "createdAt", "createdById", "department", "id", "image", "issue", "priority", "solvedAt", "status", "title", "updatedAt", "userId") SELECT "assignedToId", "createdAt", "createdById", "department", "id", "image", "issue", "priority", "solvedAt", "status", "title", "updatedAt", "userId" FROM "Ticket";
DROP TABLE "Ticket";
ALTER TABLE "new_Ticket" RENAME TO "Ticket";
CREATE UNIQUE INDEX "Ticket_id_key" ON "Ticket"("id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
