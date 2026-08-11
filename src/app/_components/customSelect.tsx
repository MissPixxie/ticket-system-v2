"use client";

import { useEffect, useRef, useState } from "react";
import { LuCheck, LuChevronDown } from "react-icons/lu";

interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function CustomSelect({
  value,
  onChange,
  options,
  placeholder = "Välj...",
  className = "",
  size = "md",
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleSelect = (option: SelectOption) => {
    onChange(option.value);
    setIsOpen(false);
  };

  const sizeClasses = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-3 text-base",
    lg: "px-4 py-3.5 text-base",
  };

  return (
    <div ref={selectRef} className={`relative ${className}`}>
      {/* SELECT BUTTON */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex w-full items-center justify-between gap-3 rounded-lg border transition-all duration-200 outline-none ${sizeClasses[size]} ${
          isOpen
            ? "border-purple-500 bg-white/10 text-white ring-4 ring-purple-500/10"
            : "border-white/10 bg-white/5 text-white hover:bg-white/10"
        }`}
      >
        <span className={selectedOption ? "text-white" : "text-white/40"}>
          {selectedOption?.label ?? placeholder}
        </span>

        <LuChevronDown
          size={18}
          className={`shrink-0 text-white/60 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* DROPDOWN */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-lg border border-white/10 bg-[#24134f] p-1 shadow-2xl shadow-black/30">
          {options.map((option) => {
            const isSelected = option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-all duration-150 ${
                  isSelected
                    ? "bg-blue-500/20 text-blue-300"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span>{option.label}</span>

                {isSelected && <LuCheck size={16} className="text-blue-400" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
