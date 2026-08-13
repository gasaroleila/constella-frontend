import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="flex-1 flex flex-col justify-center px-9 max-w-md mx-auto w-full">
      <h1 className="text-3xl font-bold tracking-tight mb-1">
        Create your account
      </h1>
      <p className="text-sm text-text-secondary mb-8">
        Start exploring real alumni paths from your school.
      </p>

      <form className="flex flex-col gap-4">
        <div className="flex gap-3">
          <label className="flex flex-col gap-1.5 flex-1">
            <span className="text-xs font-semibold text-text-secondary">First name</span>
            <input
              type="text"
              placeholder="Alex"
              className="px-3.5 py-3 rounded-lg border border-border bg-white/[0.04] text-sm outline-none focus:border-indigo focus:ring-2 focus:ring-indigo/15"
            />
          </label>
          <label className="flex flex-col gap-1.5 flex-1">
            <span className="text-xs font-semibold text-text-secondary">Last name</span>
            <input
              type="text"
              placeholder="Johnson"
              className="px-3.5 py-3 rounded-lg border border-border bg-white/[0.04] text-sm outline-none focus:border-indigo focus:ring-2 focus:ring-indigo/15"
            />
          </label>
        </div>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-text-secondary">School email</span>
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
            placeholder="Min. 8 characters"
            className="px-3.5 py-3 rounded-lg border border-border bg-white/[0.04] text-sm outline-none focus:border-indigo focus:ring-2 focus:ring-indigo/15"
          />
        </label>
        <button
          type="submit"
          className="mt-2 py-3 bg-indigo text-white rounded-lg text-sm font-semibold hover:bg-indigo-bright transition-colors"
        >
          Create Account
        </button>
      </form>

      <p className="mt-4 text-center text-xs text-text-tertiary leading-relaxed">
        By creating an account, you agree to our Terms of Service and Privacy
        Policy.
      </p>
      <p className="mt-4 text-center text-xs text-text-tertiary">
        Already have an account?{" "}
        <Link href="/login" className="text-indigo-bright font-semibold hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
