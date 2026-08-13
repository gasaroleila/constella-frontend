export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Form panel */}
      <div className="w-full md:w-1/2 flex flex-col bg-space-raised">
        {children}
      </div>
      {/* Visual panel — constellation animation (desktop only) */}
      <div className="hidden md:flex w-1/2 items-center justify-center bg-space relative overflow-hidden">
        <div className="text-center px-12 max-w-md">
          <p className="text-3xl font-bold tracking-tight leading-snug">
            Every alumnus left a map. Now you can follow it.
          </p>
          <p className="mt-4 text-sm text-text-secondary leading-relaxed">
            See what students like you actually did — the majors they chose, the
            pivots they made, and where they ended up.
          </p>
        </div>
      </div>
    </div>
  );
}
