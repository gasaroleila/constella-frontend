import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5">
        <span className="text-xl font-bold tracking-tight">Constella</span>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="text-sm px-5 py-2.5 bg-indigo text-white rounded-lg hover:bg-indigo-bright transition-colors"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight max-w-3xl">
          Every alumnus left a map.
          <br />
          Now you can follow it.
        </h1>
        <p className="mt-6 text-lg text-text-secondary max-w-xl leading-relaxed">
          See what students like you actually did — the majors they chose, the
          pivots they made, and where they ended up.
        </p>
        <Link
          href="/signup"
          className="mt-10 px-8 py-3.5 bg-indigo text-white rounded-lg text-base font-semibold hover:bg-indigo-bright transition-colors"
        >
          Start Exploring
        </Link>
      </main>
    </div>
  );
}
