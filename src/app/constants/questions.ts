import type { $Enums } from "@prisma/client";

// types.ts (Klientsidan)
export type Question = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  content: string;
  createdById: string | null;
  category: $Enums.QuestionCategory;
  status: $Enums.QuestionStatus;
};

// Typ för QuestionWithMessages
export type QuestionWithMessages = Question & {
  messages: {
    id: string;
    message: string;
    createdAt: Date;
    createdBy: {
      name: string | null;
    } | null;
  }[];
};
