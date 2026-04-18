-- AlterTable
ALTER TABLE "Resource" ADD COLUMN "url" TEXT;

-- CreateIndex
CREATE INDEX "Thread_ticketId_idx" ON "Thread"("ticketId");

-- CreateIndex
CREATE INDEX "Thread_questionId_idx" ON "Thread"("questionId");
