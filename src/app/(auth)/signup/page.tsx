"use client";

import Link from "next/link";
import { useState } from "react";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex-1 flex flex-col justify-center px-9 max-w-[420px] mx-auto w-full">
      <h1 className="text-[28px] font-bold tracking-[-0.8px] mb-1.5">
        Create your account
      </h1>
      <p className="text-[15px] text-text-secondary leading-relaxed mb-8">
        Start exploring real alumni paths from your school.
      </p>

      {/* Mode toggle */}
      <div className="flex bg-surface border border-border rounded-[10px] p-1 mb-7">
        <span className="flex-1 py-2.5 rounded-[7px] text-sm font-semibold text-center bg-indigo text-white shadow-[0_2px_8px_rgba(62,67,173,0.3)]">
          Sign Up
        </span>
        <Link
          href="/login"
          className="flex-1 py-2.5 rounded-[7px] text-sm font-semibold text-center text-text-secondary hover:text-text-primary transition-colors"
        >
          Log In
        </Link>
      </div>

      {/* Google OAuth */}
      <button className="flex items-center justify-center gap-2.5 w-full py-3 rounded-[10px] border border-border bg-surface text-text-primary text-sm font-semibold hover:bg-space-hover hover:border-border-hover transition-all mb-6">
        <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] shrink-0">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        Continue with Google
      </button>

      {/* Divider */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-text-tertiary font-medium uppercase tracking-[1px]">or</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Form */}
      <form className="flex flex-col gap-4 mb-6">
        <div className="flex gap-3">
          <label className="flex flex-col gap-1.5 flex-1">
            <span className="text-[13px] font-semibold text-text-secondary">First name</span>
            <input
              type="text"
              placeholder="Alex"
              className="px-3.5 py-3 rounded-[10px] border border-border bg-surface text-sm outline-none focus:border-indigo focus:ring-2 focus:ring-indigo/15"
            />
          </label>
          <label className="flex flex-col gap-1.5 flex-1">
            <span className="text-[13px] font-semibold text-text-secondary">Last name</span>
            <input
              type="text"
              placeholder="Johnson"
              className="px-3.5 py-3 rounded-[10px] border border-border bg-surface text-sm outline-none focus:border-indigo focus:ring-2 focus:ring-indigo/15"
            />
          </label>
        </div>
        <label className="flex flex-col gap-1.5">
          <span className="text-[13px] font-semibold text-text-secondary">School email</span>
          <input
            type="email"
            placeholder="alex@umich.edu"
            className="px-3.5 py-3 rounded-[10px] border border-border bg-surface text-sm outline-none focus:border-indigo focus:ring-2 focus:ring-indigo/15"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-[13px] font-semibold text-text-secondary">Password</span>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Min. 8 characters"
              className="w-full px-3.5 py-3 pr-11 rounded-[10px] border border-border bg-surface text-sm outline-none focus:border-indigo focus:ring-2 focus:ring-indigo/15"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary p-1"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-[18px] h-[18px]">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>
          </div>
        </label>
        <button
          type="submit"
          className="mt-2 py-3.5 bg-indigo text-white rounded-[10px] text-[15px] font-semibold hover:bg-indigo-bright hover:-translate-y-px transition-all active:translate-y-0"
        >
          Create Account
        </button>
      </form>

      <p className="text-xs text-text-tertiary leading-relaxed text-center">
        By creating an account, you agree to our{" "}
        <a href="#" className="text-text-secondary underline underline-offset-2 hover:text-text-primary">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="text-text-secondary underline underline-offset-2 hover:text-text-primary">
          Privacy Policy
        </a>
        .
      </p>

      {/* Footer */}
      <p className="mt-5 text-center text-[13px] text-text-tertiary">
        Already have an account?{" "}
        <Link href="/login" className="text-indigo-bright font-semibold hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
