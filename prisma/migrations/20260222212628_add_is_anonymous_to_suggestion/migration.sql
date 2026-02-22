-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Suggestion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'SENT',
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "suggestionBoxId" TEXT NOT NULL,
    CONSTRAINT "Suggestion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Suggestion_suggestionBoxId_fkey" FOREIGN KEY ("suggestionBoxId") REFERENCES "SuggestionBox" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Suggestion" ("content", "createdAt", "id", "status", "suggestionBoxId", "userId") SELECT "content", "createdAt", "id", "status", "suggestionBoxId", "userId" FROM "Suggestion";
DROP TABLE "Suggestion";
ALTER TABLE "new_Suggestion" RENAME TO "Suggestion";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
