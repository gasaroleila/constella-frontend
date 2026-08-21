"use client";

import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/explore": "Explore",
  "/transition": "Transition",
  "/create-path": "Create Path",
};

export function Topbar() {
  const pathname = usePathname();
  const title = pageTitles[pathname] ?? "";

  return (
    <div className="h-14 shrink-0 flex items-center justify-between px-7 border-b border-border">
      <div className="text-base font-semibold">{title}</div>
      <ThemeToggle />
    </div>
  );
}
