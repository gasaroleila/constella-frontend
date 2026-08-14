"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    label: "Explore",
    href: "/explore",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="3" />
        <line x1="12" y1="3" x2="12" y2="5" />
        <line x1="12" y1="19" x2="12" y2="21" />
        <line x1="3" y1="12" x2="5" y2="12" />
        <line x1="19" y1="12" x2="21" y2="12" />
      </svg>
    ),
  },
  {
    label: "Transition",
    href: "/transition",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M17 3l4 4-4 4" />
        <path d="M3 11h18" />
        <path d="M7 21l-4-4 4-4" />
        <path d="M21 13H3" />
      </svg>
    ),
  },
];

const secondaryItems = [
  {
    label: "Create Path",
    href: "/create-path",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M12 5v14M5 12h14" />
        <rect x="3" y="3" width="18" height="18" rx="3" />
      </svg>
    ),
  },
  {
    label: "Settings",
    href: "/settings",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
      </svg>
    ),
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="w-[220px] h-screen shrink-0 bg-space border-r border-border flex flex-col py-5">
      <div className="text-[19px] font-bold tracking-tight px-5 mb-8">
        Constella
      </div>

      <div className="flex-1 flex flex-col gap-0.5 px-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2.5 px-3 py-[9px] rounded-lg text-sm font-medium transition-all ${
              pathname === item.href
                ? "bg-indigo/15 text-indigo-bright [&_svg]:opacity-100"
                : "text-text-secondary hover:bg-surface hover:text-text-primary [&_svg]:opacity-60"
            }`}
          >
            <span className="w-[18px] h-[18px] shrink-0">{item.icon}</span>
            {item.label}
          </Link>
        ))}

        <div className="h-px bg-border mx-3 my-3" />

        {secondaryItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2.5 px-3 py-[9px] rounded-lg text-sm font-medium transition-all ${
              pathname === item.href
                ? "bg-indigo/15 text-indigo-bright [&_svg]:opacity-100"
                : "text-text-secondary hover:bg-surface hover:text-text-primary [&_svg]:opacity-60"
            }`}
          >
            <span className="w-[18px] h-[18px] shrink-0">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </div>

      {/* User profile */}
      <div className="flex items-center gap-2.5 px-5 pt-4 border-t border-border">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo to-indigo-bright flex items-center justify-center text-[13px] font-bold text-white shrink-0">
          AJ
        </div>
        <div className="min-w-0">
          <div className="text-[13px] font-semibold">Alex Johnson</div>
          <div className="text-[11px] text-text-tertiary truncate">
            University of Michigan
          </div>
        </div>
      </div>
    </nav>
  );
}
