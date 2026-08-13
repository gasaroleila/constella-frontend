"use client";

import { usePathname } from "next/navigation";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/explore": "Explore",
  "/transition": "Transition",
  "/saved": "Saved Paths",
  "/settings": "Settings",
};

export function Topbar() {
  const pathname = usePathname();
  const title = pageTitles[pathname] ?? "";

  return (
    <div className="h-14 shrink-0 flex items-center justify-between px-7 border-b border-border">
      <div className="text-base font-semibold">{title}</div>
      <div className="flex items-center gap-4">
        {/* Search box */}
        <div className="flex items-center gap-2 bg-white/4 border border-border rounded-lg px-3 py-[7px]">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-[15px] h-[15px] opacity-30"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search paths, majors..."
            className="bg-transparent border-none outline-none text-text-primary text-[13px] w-[180px] placeholder:text-text-tertiary"
          />
        </div>
        {/* Theme toggle */}
        <button className="w-[34px] h-[34px] rounded-lg border border-border bg-transparent flex items-center justify-center text-text-secondary hover:bg-white/4 hover:border-border-hover transition-all">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="w-4 h-4"
          >
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
          </svg>
        </button>
        {/* Notifications */}
        <button className="w-[34px] h-[34px] rounded-lg border border-border bg-transparent flex items-center justify-center text-text-secondary hover:bg-white/4 hover:border-border-hover transition-all">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="w-4 h-4"
          >
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
          </svg>
        </button>
      </div>
    </div>
  );
}
