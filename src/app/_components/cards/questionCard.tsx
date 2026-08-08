"use client";

import { api } from "~/trpc/react";
import type { RouterOutputs } from "~/trpc/react";
import ChatBox from "../chatBox";

type QuestionCardProps = {
  selectedQuestionId: string;
};

export default function QuestionCard({
  selectedQuestionId,
}: QuestionCardProps) {
  const utils = api.useUtils();
  const { data: selectedQuestion } = api.question.getQuestionById.useQuery(
    { id: selectedQuestionId! },
    {
      enabled: !!selectedQuestionId,
    },
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        {selectedQuestion?.conversationId && (
          <ChatBox
            conversationId={selectedQuestion?.conversationId}
            context="QUESTION"
          />
        )}
      </div>
    </div>
  );
}
