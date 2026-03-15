// ~/app/_data/dummyQuestions.ts

export interface DummyQuestion {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  createdBy: {
    id: string;
    name: string;
  };
  replies: {
    id: string;
    message: string;
    createdAt: Date;
    createdBy: {
      id: string;
      name: string;
    };
  }[];
  status: "OPEN" | "ANSWERED" | "CLOSED";
}

export const dummyQuestions: DummyQuestion[] = [
  {
    id: "q1",
    title: "Hur hanterar vi retur av trasiga produkter?",
    content:
      "Vi har fått frågor från flera butiker om hur man ska hantera trasiga produkter från kunder. Finns det ett standardförfarande?",
    createdAt: new Date("2026-03-01T10:00:00"),
    createdBy: { id: "u1", name: "Butik A" },
    replies: [
      {
        id: "r1",
        message:
          "Vi rekommenderar att ni skickar tillbaka till huvudkontoret med returformulär.",
        createdAt: new Date("2026-03-01T12:00:00"),
        createdBy: { id: "handler1", name: "HK Support" },
      },
    ],
    status: "ANSWERED",
  },
  {
    id: "q2",
    title: "Kan vi beställa fler färgade skyltar?",
    content:
      "Flera butiker har efterfrågat fler färgade skyltar till kampanjbordet. Är det möjligt att beställa direkt?",
    createdAt: new Date("2026-03-02T09:30:00"),
    createdBy: { id: "u2", name: "Butik B" },
    replies: [],
    status: "OPEN",
  },
  {
    id: "q3",
    title: "Problem med kassaapparaten",
    content:
      "Kassaapparaten stannar ibland mitt under betalning. Någon mer som upplever samma problem?",
    createdAt: new Date("2026-03-03T14:20:00"),
    createdBy: { id: "u3", name: "Butik C" },
    replies: [
      {
        id: "r2",
        message:
          "Vi har rapporterat detta till IT. Se till att uppdatera mjukvaran regelbundet.",
        createdAt: new Date("2026-03-03T15:00:00"),
        createdBy: { id: "handler2", name: "HK IT" },
      },
    ],
    status: "ANSWERED",
  },
  {
    id: "q4",
    title: "Kan vi få manual för nya kaffemaskinen?",
    content:
      "Vi behöver en uppdaterad manual för den nya kaffemaskinen som levererades förra veckan.",
    createdAt: new Date("2026-03-04T11:45:00"),
    createdBy: { id: "u4", name: "Butik D" },
    replies: [],
    status: "OPEN",
  },
];
