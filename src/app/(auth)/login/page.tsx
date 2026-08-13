import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex-1 flex flex-col justify-center px-9 max-w-md mx-auto w-full">
      <h1 className="text-3xl font-bold tracking-tight mb-1">Welcome back</h1>
      <p className="text-sm text-text-secondary mb-8">
        Sign in to continue exploring your constellation.
      </p>

      <form className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-text-secondary">Email</span>
          <input
            type="email"
            placeholder="alex@umich.edu"
            className="px-3.5 py-3 rounded-lg border border-border bg-white/[0.04] text-sm outline-none focus:border-indigo focus:ring-2 focus:ring-indigo/15"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-text-secondary">Password</span>
          <input
            type="password"
            placeholder="Enter your password"
            className="px-3.5 py-3 rounded-lg border border-border bg-white/[0.04] text-sm outline-none focus:border-indigo focus:ring-2 focus:ring-indigo/15"
          />
        </label>
        <button
          type="submit"
          className="mt-2 py-3 bg-indigo text-white rounded-lg text-sm font-semibold hover:bg-indigo-bright transition-colors"
        >
          Sign In
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-text-tertiary">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-indigo-bright font-semibold hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
