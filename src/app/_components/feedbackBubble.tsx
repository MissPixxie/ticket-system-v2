"use client";

import { useEffect } from "react";
import ReactDOM from "react-dom";

interface FeedbackBubbleProps {
  open: boolean;
  message: string;
  type?: "success" | "error" | "info";
  duration?: number;
  onClose: () => void;
}

export default function FeedbackBubble({
  open,
  message,
  type = "success",
  duration = 1200,
  onClose,
}: FeedbackBubbleProps) {
  useEffect(() => {
    if (!open) return;

    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [open, duration, onClose]);

  if (!open) return null;

  const colors = {
    success: "border-green-500/30 bg-green-500/20",
    error: "border-red-500/30 bg-red-500/20",
    info: "border-blue-500/30 bg-blue-500/20",
  };

  return ReactDOM.createPortal(
    <div className="pointer-events-none fixed inset-0 z-9999 flex items-center justify-center">
      <div
        className={`animate-in fade-in zoom-in-95 animate-[pop_200ms_ease] rounded-2xl border px-8 py-5 text-lg font-medium text-white shadow-2xl backdrop-blur-xl ${colors[type]}`}
      >
        {message}
      </div>
    </div>,
    document.body,
  );
}
