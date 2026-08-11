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

    case "TICKET_PARTICIPANT_ADDED":
      return `${actor} lade till en deltagare i ärendet "${metadata.title}".`;

    case "TICKET_MESSAGE_SENT":
    case "QUESTION_MESSAGE_SENT":
    case "RESOURCE_MESSAGE_SENT":
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

export function formatStatus(status?: string) {
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

export function formatPriority(priority?: string) {
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

export function getPriorityClass(priority?: string) {
  switch (priority) {
    case "LOW":
      return "bg-green-500/20 text-green-300";
    case "MEDIUM":
      return "bg-yellow-500/20 text-yellow-300";
    case "HIGH":
      return "bg-orange-500/20 text-orange-300";
    case "URGENT":
      return "bg-red-500/20 text-red-300";
    default:
      return "";
  }
}

export function formatSuggestionStatus(status?: string) {
  switch (status) {
    case "SENT":
      return "Skickad";
    case "UNDER_REVIEW":
      return "Under granskning";
    case "APPROVED":
      return "Godkänd";
    case "IMPLEMENTED":
      return "Implementerad";
    case "REJECTED":
      return "Avslagen";
    default:
      return status;
  }
}

export function getStatusClass(status?: string) {
  switch (status) {
    case "OPEN":
      return "bg-blue-500/20 text-blue-300";
    case "IN_PROGRESS":
      return "bg-yellow-500/20 text-yellow-300";
    case "CLOSED":
      return "bg-gray-500/20 text-gray-300";
    default:
      return "";
  }
}

export function formatNewsCategory(category?: string) {
  switch (category) {
    case "NEWS":
      return "Allmänt";
    case "STORE_MANUAL":
      return "Butiks manual";
    case "PRODUCT_INFORMATION":
      return "Produkt information";
    case "CAMPAIGN":
      return "Kampanj";
    default:
      return category;
  }
}

export function formatResourceCategory(category?: string) {
  switch (category) {
    case "DOCUMENTATION":
      return "Dokumentation";
    case "TUTORIAL":
      return "Tutorial";
    case "INFORMATION":
      return "Information";
    case "OTHER":
      return "Övrigt";
    default:
      return category;
  }
}
