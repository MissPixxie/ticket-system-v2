// types.ts (Klientsidan)
export type Question = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  question: string;
  createdById: string | null;
  conversationId: string | null;
  embedding: string | null;
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
