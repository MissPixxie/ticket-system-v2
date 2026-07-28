/*
  Warnings:

  - You are about to drop the `GeneralMessage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `NewsComment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Thread` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_GeneralMessageRecipients` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_GeneralMessageToUserDepartment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_MessageReceivers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_TicketParticipants` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `createdById` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `message` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `threadId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `generalMessageId` on the `User` table. All the data in the column will be lost.
  - Added the required column `content` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `conversationId` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "NewsComment_newsId_idx";

-- DropIndex
DROP INDEX "Post_name_idx";

-- DropIndex
DROP INDEX "Thread_id_key";

-- DropIndex
DROP INDEX "Thread_questionId_idx";

-- DropIndex
DROP INDEX "Thread_ticketId_idx";

-- DropIndex
DROP INDEX "Thread_id_idx";

-- DropIndex
DROP INDEX "Thread_questionId_key";

-- DropIndex
DROP INDEX "Thread_ticketId_key";

-- DropIndex
DROP INDEX "_GeneralMessageRecipients_B_index";

-- DropIndex
DROP INDEX "_GeneralMessageRecipients_AB_unique";

-- DropIndex
DROP INDEX "_GeneralMessageToUserDepartment_B_index";

-- DropIndex
DROP INDEX "_GeneralMessageToUserDepartment_AB_unique";

-- DropIndex
DROP INDEX "_MessageReceivers_B_index";

-- DropIndex
DROP INDEX "_MessageReceivers_AB_unique";

-- DropIndex
DROP INDEX "_TicketParticipants_B_index";

-- DropIndex
DROP INDEX "_TicketParticipants_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "GeneralMessage";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "NewsComment";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Post";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Thread";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_GeneralMessageRecipients";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_GeneralMessageToUserDepartment";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_MessageReceivers";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_TicketParticipants";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ConversationParticipant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "conversationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'MEMBER',
    "lastReadAt" DATETIME,
    "joinedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ConversationParticipant_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ConversationParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Message" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "conversationId" TEXT NOT NULL,
    "senderId" TEXT,
    "type" TEXT NOT NULL DEFAULT 'USER_MESSAGE',
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Message" ("createdAt", "id", "type") SELECT "createdAt", "id", "type" FROM "Message";
DROP TABLE "Message";
ALTER TABLE "new_Message" RENAME TO "Message";
CREATE INDEX "Message_conversationId_idx" ON "Message"("conversationId");
CREATE INDEX "Message_senderId_idx" ON "Message"("senderId");
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
    "embedding" TEXT,
    "conversationId" TEXT,
    CONSTRAINT "News_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "News_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_News" ("category", "content", "createdAt", "createdById", "downVotes", "embedding", "id", "isPinned", "isPublished", "priority", "title", "upVotes", "updatedAt") SELECT "category", "content", "createdAt", "createdById", "downVotes", "embedding", "id", "isPinned", "isPublished", "priority", "title", "upVotes", "updatedAt" FROM "News";
DROP TABLE "News";
ALTER TABLE "new_News" RENAME TO "News";
CREATE UNIQUE INDEX "News_conversationId_key" ON "News"("conversationId");
CREATE INDEX "News_isPublished_idx" ON "News"("isPublished");
CREATE TABLE "new_Question" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "question" TEXT NOT NULL,
    "createdById" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "conversationId" TEXT,
    "embedding" TEXT,
    CONSTRAINT "Question_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Question_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Question" ("createdAt", "createdById", "embedding", "id", "question", "updatedAt") SELECT "createdAt", "createdById", "embedding", "id", "question", "updatedAt" FROM "Question";
DROP TABLE "Question";
ALTER TABLE "new_Question" RENAME TO "Question";
CREATE UNIQUE INDEX "Question_conversationId_key" ON "Question"("conversationId");
CREATE INDEX "Question_createdAt_idx" ON "Question"("createdAt");
CREATE INDEX "Question_createdById_idx" ON "Question"("createdById");
CREATE TABLE "new_Suggestion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'SENT',
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT,
    "suggestionBoxId" TEXT NOT NULL,
    "voteCount" INTEGER NOT NULL DEFAULT 0,
    "embedding" TEXT,
    "conversationId" TEXT,
    CONSTRAINT "Suggestion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Suggestion_suggestionBoxId_fkey" FOREIGN KEY ("suggestionBoxId") REFERENCES "SuggestionBox" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Suggestion_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Suggestion" ("content", "createdAt", "embedding", "id", "isAnonymous", "status", "suggestionBoxId", "userId", "voteCount") SELECT "content", "createdAt", "embedding", "id", "isAnonymous", "status", "suggestionBoxId", "userId", "voteCount" FROM "Suggestion";
DROP TABLE "Suggestion";
ALTER TABLE "new_Suggestion" RENAME TO "Suggestion";
CREATE UNIQUE INDEX "Suggestion_conversationId_key" ON "Suggestion"("conversationId");
CREATE INDEX "Suggestion_status_idx" ON "Suggestion"("status");
CREATE INDEX "Suggestion_suggestionBoxId_idx" ON "Suggestion"("suggestionBoxId");
CREATE INDEX "Suggestion_userId_idx" ON "Suggestion"("userId");
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
    "createdById" TEXT,
    "assignedToId" TEXT,
    "conversationId" TEXT,
    "signedByUser" BOOLEAN NOT NULL DEFAULT false,
    "signedByHandler" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Ticket_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Ticket_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Ticket_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Ticket" ("assignedToId", "createdAt", "createdById", "department", "id", "image", "isAnonymous", "issue", "priority", "signedByHandler", "signedByUser", "solvedAt", "status", "title", "updatedAt") SELECT "assignedToId", "createdAt", "createdById", "department", "id", "image", "isAnonymous", "issue", "priority", "signedByHandler", "signedByUser", "solvedAt", "status", "title", "updatedAt" FROM "Ticket";
DROP TABLE "Ticket";
ALTER TABLE "new_Ticket" RENAME TO "Ticket";
CREATE UNIQUE INDEX "Ticket_conversationId_key" ON "Ticket"("conversationId");
CREATE INDEX "Ticket_createdById_idx" ON "Ticket"("createdById");
CREATE INDEX "Ticket_assignedToId_idx" ON "Ticket"("assignedToId");
CREATE INDEX "Ticket_status_idx" ON "Ticket"("status");
CREATE INDEX "Ticket_department_idx" ON "Ticket"("department");
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
CREATE INDEX "User_id_idx" ON "User"("id");
CREATE INDEX "User_email_idx" ON "User"("email");
CREATE INDEX "User_createdAt_idx" ON "User"("createdAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "Conversation_createdAt_idx" ON "Conversation"("createdAt");

-- CreateIndex
CREATE INDEX "ConversationParticipant_conversationId_idx" ON "ConversationParticipant"("conversationId");

-- CreateIndex
CREATE INDEX "ConversationParticipant_userId_idx" ON "ConversationParticipant"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ConversationParticipant_conversationId_userId_key" ON "ConversationParticipant"("conversationId", "userId");
