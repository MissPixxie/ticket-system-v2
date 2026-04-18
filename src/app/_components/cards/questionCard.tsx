"use client";

import { api } from "~/trpc/react";
import type { RouterOutputs } from "~/trpc/react";
import ChatBox from "../chatBox";

type Question = RouterOutputs["question"]["listQuestions"][number];

type QuestionCardProps = Question & { currentUserId: string | null };

export default function QuestionCard({
  currentUserId,
  ...questionProps
}: QuestionCardProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        {currentUserId && questionProps.thread?.id && (
          <ChatBox
            threadId={questionProps.thread.id}
            currentUserId={currentUserId}
          />
        )}
      </div>
    </div>
  );
}
