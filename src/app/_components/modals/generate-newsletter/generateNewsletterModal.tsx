"use client";

import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { IoSparklesSharp } from "react-icons/io5";

interface Newsletter {
  subject: string;
  body: string;
}

interface GenerateNewsletterModalProps {
  open: boolean;
  newsletter: Newsletter | null;
  onClose: () => void;
}

export default function GenerateNewsletterModal({
  open,
  newsletter,
  onClose,
}: GenerateNewsletterModalProps) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => {
    if (newsletter) {
      setSubject(newsletter.subject);
      setBody(newsletter.body);
    }
  }, [newsletter]);

  if (!open || !newsletter) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl rounded-lg bg-linear-to-b from-[#3b0e7a]/70 to-[#282a53]/70 p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-5 flex items-center gap-2 text-xl font-semibold text-white">
          <IoSparklesSharp size={18} />
          AI-genererat nyhetsbrev
        </h2>

        <div className="flex flex-col gap-4">
          <div>
            <label className="mb-2 block text-sm text-white/60">Ämne</label>

            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/60">
              Meddelande
            </label>

            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={12}
              className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-purple-500"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white/80 hover:bg-white/10"
          >
            Avbryt
          </button>

          <button className="rounded-xl bg-blue-600 px-5 py-2 text-white hover:bg-blue-500">
            Skicka nyhetsbrev
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
