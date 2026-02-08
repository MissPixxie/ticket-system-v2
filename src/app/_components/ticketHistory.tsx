// components/TicketHistory.tsx
type Action = {
  id: string;
  actionType: string;
  timestamp: Date;
  user: { name: string | null };
};

export function TicketHistory({ actions }: { actions: Action[] }) {
  const getActionMessage = (type: string) => {
    const messages: Record<string, string> = {
      CREATED: "skapade ärendet",
      CHANGED_STATUS: "ändrade status",
      CHANGED_PRIORITY: "ändrade prioritet",
      ASSIGNED: "tilldelade ärendet",
      SENT: "skickade ett meddelande",
    };
    return messages[type] ?? type.toLowerCase().replace("_", " ");
  };

  return (
    <div className="mt-6 space-y-4">
      <h3 className="text-sm font-bold tracking-wider uppercase opacity-50">
        Historik
      </h3>
      <div className="space-y-3">
        {actions.map((action) => (
          <div key={action.id} className="flex items-start gap-3 text-sm">
            <div className="mt-1.5 h-2 w-2 rounded-full bg-blue-500" />
            <div>
              <p>
                <span className="font-semibold">{action.user.name}</span>{" "}
                {getActionMessage(action.actionType)}
              </p>
              <p className="text-xs opacity-40">
                {action.timestamp.toLocaleString("sv-SE")}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
