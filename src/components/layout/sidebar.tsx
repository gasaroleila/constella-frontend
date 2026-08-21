"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth";
import { ConstellaIcon } from "@/components/ui/constella-icon";

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
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);

  return (
    <nav className="w-[220px] h-screen shrink-0 bg-space border-r border-border flex flex-col py-5">
      <div className="flex items-center gap-2.5 px-5 mb-8">
        <ConstellaIcon className="w-7 h-7" />
        <span className="text-[19px] font-bold tracking-tight">Constella</span>
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
          {user ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}` : "?"}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-semibold">{user ? `${user.firstName} ${user.lastName}` : "Guest"}</div>
          <div className="text-[11px] text-text-tertiary truncate">
            {user?.school ?? ""}
          </div>
        </div>
        <button
          onClick={() => { logout(); router.push("/login"); }}
          title="Log out"
          className="text-text-tertiary hover:text-text-primary transition-colors shrink-0"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-[18px] h-[18px]">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </div>
    </nav>
  );
}
