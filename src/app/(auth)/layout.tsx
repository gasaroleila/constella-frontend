import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Form panel */}
      <div className="w-full md:w-1/2 flex flex-col bg-space-raised overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-9 py-6 shrink-0">
          <Link href="/" className="text-[20px] font-bold tracking-[-0.5px]">
            Constella
          </Link>
          <ThemeToggle />
        </div>

        {/* Form body */}
        {children}

        {/* Spacer so form body stays centered */}
        <div className="shrink-0 h-6" />
      </div>

      {/* Visual panel (desktop only) */}
      <div className="hidden md:flex w-1/2 flex-col items-center justify-center bg-[var(--t-visual-bg)] relative overflow-hidden">
        {/* Glow */}
        <div className="absolute w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(62,67,173,0.2)_0%,transparent_70%)] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

        {/* Content */}
        <div className="relative z-[2] text-center px-12 max-w-[480px] pointer-events-none">
          <p className="text-[32px] font-bold tracking-[-1px] leading-[1.2] mb-4 text-balance">
            Every alumnus left a map. Now you can follow it.
          </p>
          <p className="text-[15px] leading-relaxed text-text-secondary max-w-[360px] mx-auto">
            See what students like you actually did — the majors they chose, the
            pivots they made, and where they ended up.
          </p>
          {/* Stats */}
          <div className="flex justify-center gap-10 mt-9">
            {[
              { number: "68+", label: "Alumni paths" },
              { number: "7", label: "Career clusters" },
              { number: "92%", label: "Match accuracy" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-bold text-indigo-bright tabular-nums">
                  {stat.number}
                </div>
                <div className="text-xs text-text-tertiary mt-1 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
