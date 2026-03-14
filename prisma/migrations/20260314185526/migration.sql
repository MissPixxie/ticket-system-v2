/*
  Warnings:

  - You are about to drop the column `department` on the `User` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "UserDepartment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    CONSTRAINT "UserDepartment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT,
    "password" TEXT,
    "emailVerified" BOOLEAN DEFAULT false,
    "image" TEXT,
    "roleId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "suggestionId" TEXT,
    CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("createdAt", "email", "emailVerified", "id", "image", "name", "password", "roleId", "suggestionId", "updatedAt") SELECT "createdAt", "email", "emailVerified", "id", "image", "name", "password", "roleId", "suggestionId", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "UserDepartment_userId_department_key" ON "UserDepartment"("userId", "department");
