"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { RiArrowUpDoubleFill } from "react-icons/ri";
import { FaLightbulb } from "react-icons/fa";
import { FaRegClock } from "react-icons/fa";
import { GoTrophy } from "react-icons/go";
import { toast } from "sonner";
import { useSocket } from "~/app/socketProvider";
import { IoConstruct } from "react-icons/io5";

export default function SettingsPage() {
  return (
    <main className="flex min-h-screen justify-center px-6 py-12 text-white">
      <div className="flex w-full max-w-5xl rounded-2xl bg-white/5 p-8 backdrop-blur-lg">
        Settings page under construction...
        <div className="text-white/5 self-center">
          <IoConstruct size={450} />
        </div>
      </div>
    </main>
  );
}
