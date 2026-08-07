import type { Prisma } from "@prisma/client";

type NotificationWithEvent = Prisma.NotificationGetPayload<{
  include: {
    event: {
      include: {
        actor: true;
      };
    };
  };
}>;

type EventMetadata = {
  title?: string;
  newStatus?: string;
  oldStatus?: string;
  newPriority?: string;
  oldPriority?: string;
};

export function formatNotification(notification: NotificationWithEvent) {
  const event = notification.event;
  const actor = event.actor?.name ?? "Någon";
  const metadata = event.metadata as EventMetadata;

  switch (event.type) {
    case "TICKET_CREATED":
      return `${actor} skapade ärendet "${metadata.title}".`;

    case "TICKET_STATUS_CHANGED":
      return `${actor} ändrade status på "${metadata.title}" från ${formatStatus(metadata.oldStatus)} till ${formatStatus(metadata.newStatus)}.`;

    case "TICKET_CHANGED_PRIORITY":
      return `${actor} ändrade prioriteten på "${metadata.title}" från ${formatPriority(metadata.oldPriority)} till ${formatPriority(metadata.newPriority)}.`;

    case "TICKET_ASSIGNED":
      return `${actor} tog över ärendet "${metadata.title}".`;

    case "MESSAGE_SENT":
      return `${actor} skickade ett nytt meddelande i "${metadata.title}".`;

    case "SUGGESTION_CREATED":
      return `${actor} skapade ett nytt förslag "${metadata.title}".`;

    case "SUGGESTION_STATUS_CHANGED":
      return `${actor} ändrade status på förslaget "${metadata.title}" från ${metadata.oldStatus} till ${metadata.newStatus}.`;

    case "QUESTION_CREATED":
      return `${actor} skapade frågan "${metadata.title}".`;

    case "RESOURCE_CREATED":
      return `${actor} skapade resursen "${metadata.title}".`;

    case "NEWS_CREATED":
      return `${actor} skapade nyheten "${metadata.title}".`;

    default:
      return "Ny aktivitet.";
  }
}

function formatStatus(status?: string) {
  switch (status) {
    case "OPEN":
      return "Öppen";
    case "IN_PROGRESS":
      return "Pågående";
    case "CLOSED":
      return "Stängd";
    default:
      return status;
  }
}

function formatPriority(priority?: string) {
  switch (priority) {
    case "LOW":
      return "Låg";
    case "MEDIUM":
      return "Medel";
    case "HIGH":
      return "Hög";
    case "URGENT":
      return "Akut";
    default:
      return priority;
  }
}
