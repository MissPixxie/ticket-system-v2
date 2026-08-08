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
  content?: string;
  messagePreview?: string;
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

    case "TICKET_MESSAGE_SENT":
      return `${actor} skickade ett nytt meddelande i "${getDisplayText(metadata)}".`;

    case "QUESTION_MESSAGE_SENT":
      return `${actor} skickade ett nytt meddelande i "${getDisplayText(metadata)}".`;

    case "RESOURCE_MESSAGE_SENT":
      return `${actor} skickade ett nytt meddelande i "${getDisplayText(metadata)}".`;

    case "NEWS_MESSAGE_SENT":
      return `${actor} skickade ett nytt meddelande i "${getDisplayText(metadata)}".`;
    case "SUGGESTION_CREATED":
      return `${actor} skapade ett nytt förslag "${getDisplayText(metadata)}".`;

    case "SUGGESTION_STATUS_CHANGED":
      return `${actor} ändrade status på förslaget "${getDisplayText(metadata)}" från ${metadata.oldStatus} till ${metadata.newStatus}.`;

    case "QUESTION_CREATED":
      return `${actor} skapade frågan "${getDisplayText(metadata)}".`;

    case "RESOURCE_CREATED":
      return `${actor} skapade resursen "${getDisplayText(metadata)}".`;

    case "NEWS_CREATED":
      return `${actor} skapade nyheten "${getDisplayText(metadata)}".`;

    default:
      return "Ny aktivitet.";
  }
}

function getDisplayText(metadata: EventMetadata) {
  if (metadata.title) return metadata.title;

  if (metadata.messagePreview) {
    return metadata.messagePreview.slice(0, 10);
  }

  if (metadata.content) {
    return metadata.content.slice(0, 10);
  }

  return "okänt";
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
