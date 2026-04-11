/*
  Warnings:

  - You are about to drop the column `voteCount` on the `News` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_News" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'NEWS',
    "content" TEXT NOT NULL,
    "createdById" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "priority" TEXT NOT NULL DEFAULT 'LOW',
    "upVotes" INTEGER NOT NULL DEFAULT 0,
    "downVotes" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "News_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_News" ("category", "content", "createdAt", "createdById", "downVotes", "id", "isPinned", "isPublished", "priority", "title", "upVotes", "updatedAt") SELECT "category", "content", "createdAt", "createdById", "downVotes", "id", "isPinned", "isPublished", "priority", "title", "upVotes", "updatedAt" FROM "News";
DROP TABLE "News";
ALTER TABLE "new_News" RENAME TO "News";
CREATE INDEX "News_isPublished_idx" ON "News"("isPublished");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
