"use client";

export default function ResourceCard({
  resourceItem,
}: {
  resourceItem: { id: string; title: string; description: string };
}) {
  return (
    <a
      key={resourceItem.id}
      href="#"
      className="card flex flex-col justify-between"
    >
      <h2 className="text-lg font-semibold">{resourceItem.title}</h2>
      <p className="mt-2 text-sm text-white/70">{resourceItem.description}</p>
    </a>
  );
}
