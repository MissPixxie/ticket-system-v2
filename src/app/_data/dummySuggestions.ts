// ~/app/_data/dummySuggestions.ts

export type SuggestionStatus =
  | "SENT"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "IMPLEMENTED";

export interface DummyVote {
  id: string;
  type: "UPVOTE" | "DOWNVOTE";
  user: {
    id: string;
    name: string;
  };
}

export interface DummySuggestion {
  id: string;
  content: string;
  createdAt: Date;
  status: SuggestionStatus;
  isAnonymous: boolean;
  user: {
    id: string;
    name: string;
  };
  suggestionBoxId: string;
  votes: DummyVote[];
}

export const dummySuggestions: DummySuggestion[] = [
  {
    id: "s1",
    content: "Införa fler ekologiska produkter i sortimentet.",
    createdAt: new Date("2026-03-01T09:00:00"),
    status: "SENT",
    isAnonymous: false,
    user: { id: "u1", name: "Butik A" },
    suggestionBoxId: "box1",
    votes: [
      { id: "v1", type: "UPVOTE", user: { id: "u2", name: "Butik B" } },
      { id: "v2", type: "UPVOTE", user: { id: "u3", name: "Butik C" } },
    ],
  },
  {
    id: "s2",
    content: "Bättre skyltning för kampanjbordet.",
    createdAt: new Date("2026-03-02T10:30:00"),
    status: "UNDER_REVIEW",
    isAnonymous: false,
    user: { id: "u2", name: "Butik B" },
    suggestionBoxId: "box1",
    votes: [],
  },
  {
    id: "s3",
    content: "Ny betalterminal som inte hänger sig.",
    createdAt: new Date("2026-03-03T11:45:00"),
    status: "APPROVED",
    isAnonymous: false,
    user: { id: "u3", name: "Butik C" },
    suggestionBoxId: "box1",
    votes: [{ id: "v3", type: "UPVOTE", user: { id: "u1", name: "Butik A" } }],
  },
  {
    id: "s4",
    content: "Mer personal under helger för att hantera högre kundflöden.",
    createdAt: new Date("2026-03-04T08:15:00"),
    status: "REJECTED",
    isAnonymous: false,
    user: { id: "u4", name: "Butik D" },
    suggestionBoxId: "box1",
    votes: [],
  },
  {
    id: "s5",
    content: "Digital butikshandbok via appen.",
    createdAt: new Date("2026-03-05T14:00:00"),
    status: "IMPLEMENTED",
    isAnonymous: true,
    user: { id: "u5", name: "Butik E" },
    suggestionBoxId: "box1",
    votes: [
      { id: "v4", type: "UPVOTE", user: { id: "u1", name: "Butik A" } },
      { id: "v5", type: "UPVOTE", user: { id: "u3", name: "Butik C" } },
    ],
  },
];
