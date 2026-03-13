export function formatNotification(notification: any) {
  const event = notification.event;
  const actor = event.actor?.name ?? "Någon";

  switch (event.type) {
    case "TICKET_CREATED":
      return `${actor} skapade ett ärende`;

    case "TICKET_STATUS_CHANGED":
      return `${actor} ändrade status till ${event.metadata?.newStatus}`;

    case "TICKET_CHANGED_PRIORITY":
      return `${actor} ändrade prioritet till ${event.metadata?.newPriority}`;

    case "TICKET_ASSIGNED":
      return `${actor} tilldelade en användare`;

    case "MESSAGE_ADDED":
      return `${actor} skickade ett meddelande`;

    case "SUGGESTION_CREATED":
      return `${actor} skapade ett förslag`;

    case "SUGGESTION_STATUS_CHANGED":
      return `${actor} ändrade status på ett förslag`;

    default:
      return "Ny aktivitet";
  }
}
