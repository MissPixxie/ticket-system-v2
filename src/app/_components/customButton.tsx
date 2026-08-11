"use client";

import { useState, type ReactNode } from "react";

interface CustomButtonProps {
  title: string;
  icon?: ReactNode;
  onClick?: () => void;
  className?: string;
  size?: "sm" | "md";
}

export default function CustomButton({
  title,
  icon,
  onClick,
  className = "",
  size = "md",
}: CustomButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const sizeClasses = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-3 text-base",
  };

  return (
    <button
      onClick={onClick}
      className="flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/80 shadow-lg shadow-black/10 transition-all duration-200 hover:border-blue-400/40 hover:bg-blue-500/10 hover:text-blue-300 active:scale-[0.98]"
    >
      {icon && <span className="self-center text-blue-300">{icon}</span>}
      <span>{title}</span>
    </button>
  );
}
