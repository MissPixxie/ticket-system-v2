"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { RiArrowUpDoubleFill } from "react-icons/ri";
import { FaLightbulb } from "react-icons/fa";
import { FaRegClock } from "react-icons/fa";
import { GoTrophy } from "react-icons/go";
import { toast } from "sonner";
import { useSocket } from "~/app/socketProvider";

export default function NewsPage() {
  return (
    <main className="flex min-h-screen justify-center px-6 py-12 text-white">
      <div className="w-full max-w-5xl rounded-2xl bg-white/5 p-8 backdrop-blur-lg">
        News page under construction...
      </div>
    </main>
  );
}
