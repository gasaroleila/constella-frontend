"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { ConstellaIcon } from "@/components/ui/constella-icon";
import { DecorativeConstellation } from "@/components/constellation/decorative-constellation";
import { DemoSection } from "@/components/landing/demo-section";
import { ToolExplorer } from "@/components/landing/tool-explorer";
import "./landing.css";

export default function LandingPage() {
  // Scroll reveal
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const observers: IntersectionObserver[] = [];
    els.forEach((el) => {
      const obs = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) el.classList.add("visible");
        },
        { threshold: 0.12, rootMargin: "0px 0px -30px 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <div>
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-12 py-5 bg-[color-mix(in_srgb,var(--color-space)_85%,transparent)] backdrop-blur-[12px] border-b border-border max-md:px-6">
        <Link href="/" className="flex items-center gap-2 text-[22px] font-bold tracking-tight">
          <ConstellaIcon className="w-7 h-7" />
          Constella
        </Link>
        <div className="flex items-center gap-8">
          <Link href="#how-it-works" className="text-sm font-semibold text-text-secondary hover:text-text-primary transition-colors max-md:hidden">
            How It Works
          </Link>
          <Link href="#features" className="text-sm font-semibold text-text-secondary hover:text-text-primary transition-colors max-md:hidden">
            The Why
          </Link>
          <Link href="#tools" className="text-sm font-semibold text-text-secondary hover:text-text-primary transition-colors max-md:hidden">
            Our Solution
          </Link>
          <ThemeToggle />
          <Link href="/login" className="text-sm font-semibold text-text-secondary hover:text-text-primary transition-colors">
            Log In
          </Link>
          <Link href="/signup" className="text-sm font-bold px-[22px] py-2.5 bg-indigo text-white rounded-[10px] hover:bg-indigo-bright hover:-translate-y-px transition-all">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="min-h-screen flex items-center px-12 pt-[120px] pb-20 relative overflow-hidden max-md:px-6 max-md:pt-24">
        <div className="grid grid-cols-2 gap-16 max-w-[1280px] mx-auto w-full items-center relative z-[2] max-md:grid-cols-1 max-md:gap-10">
          <div className="max-w-[560px]">
            <h1 className="text-[clamp(36px,5vw,56px)] font-bold leading-[1.08] tracking-[-1.5px] mb-5 text-balance">
              See what students{" "}
              <em className="not-italic text-indigo-bright">like you</em>{" "}
              actually did.
            </h1>
            <p className="text-lg leading-relaxed text-text-secondary mb-9 max-w-[460px]">
              Constella surfaces real alumni paths from your school — the majors
              they chose, the pivots they made, and where they ended up. Your
              school&apos;s data, your story&apos;s possibilities.
            </p>
            <div className="flex gap-3.5 mb-7 flex-wrap max-sm:flex-col">
              <Link href="/signup" className="inline-flex items-center px-7 py-3.5 bg-indigo text-white rounded-[10px] text-[15px] font-bold hover:bg-indigo-bright hover:-translate-y-px transition-all max-sm:justify-center">
                Get Started
              </Link>
              <Link href="#how-it-works" className="inline-flex items-center px-7 py-3.5 border border-border text-text-primary rounded-[10px] text-[15px] font-bold hover:border-border-hover hover:bg-surface transition-all max-sm:justify-center">
                See How It Works
              </Link>
            </div>
            <div className="flex items-center gap-2 text-[13px] text-text-secondary">
              <div className="flex">
                {["#6366F1", "#8B5CF6", "#A78BFA", "#C4B5FD"].map((color, i) => (
                  <span key={i} className="w-6 h-6 rounded-full border-2 border-space block" style={{ background: color, marginLeft: i > 0 ? "-8px" : 0 }} />
                ))}
              </div>
              Join 500+ students exploring their paths
            </div>
          </div>
          <div className="relative flex items-center justify-center reveal from-right">
            <div className="absolute w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(62,67,173,0.2)_0%,transparent_70%)] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="w-full h-[500px] max-md:h-[300px]">
              <DecorativeConstellation />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="px-12 py-12 border-y border-border max-md:px-6">
        <div className="max-w-[900px] mx-auto flex justify-center gap-16 flex-wrap max-md:gap-8">
          {[
            { number: "68+", label: "Alumni paths" },
            { number: "7", label: "Career clusters" },
            { number: "5", label: "Matching signals" },
            { number: "3", label: "Discovery tools" },
          ].map((stat, i) => (
            <div key={stat.label} className="text-center reveal" style={{ transitionDelay: `${i * 100}ms` }}>
              <div className="text-4xl font-bold text-indigo tracking-tight tabular-nums">{stat.number}</div>
              <div className="text-sm text-text-secondary mt-1 font-semibold">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Demo */}
      <DemoSection />

      {/* Problem */}
      <section className="px-12 py-[100px] max-md:px-6" id="features">
        <div className="max-w-[1120px] mx-auto">
          <p className="text-[clamp(24px,3vw,36px)] font-bold leading-[1.2] tracking-tight text-center mb-14 text-balance max-w-[700px] mx-auto reveal">
            43% of students change their major at least once.{" "}
            <span className="text-indigo-bright">Most do it blind.</span>
          </p>
          <div className="grid grid-cols-3 gap-8 max-md:grid-cols-1">
            {[
              {
                title: "You get generic advice",
                desc: "Your advisor gives the same guidance to everyone. \"Explore your options\" doesn't help when you don't know what the options are.",
                icon: <><circle cx="12" cy="12" r="9" /><path d="M12 8v4M12 16h.01" /></>,
              },
              {
                title: "You can't see real outcomes",
                desc: "What did alumni from YOUR school actually do with a Psych degree? A Bio + CS double major? Nobody shows you that.",
                icon: <><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><line x1="4" y1="4" x2="20" y2="20" /></>,
              },
              {
                title: "Pivots feel terrifying",
                desc: "Switching majors feels like starting over because you can't see who did it before you — or how it turned out.",
                icon: <><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83" /><circle cx="12" cy="12" r="4" strokeDasharray="3 3" /></>,
              },
            ].map((card, i) => (
              <div key={card.title} className="p-8 rounded-xl bg-surface border border-border reveal" style={{ transitionDelay: `${i * 150}ms` }}>
                <div className="w-12 h-12 mb-5 rounded-[10px] flex items-center justify-center bg-indigo/10">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#5B60E8" strokeWidth="1.5" strokeLinecap="round" className="w-6 h-6">
                    {card.icon}
                  </svg>
                </div>
                <h3 className="text-lg font-bold tracking-tight mb-2.5">{card.title}</h3>
                <p className="text-[15px] leading-relaxed text-text-secondary">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tool Explorer */}
      <ToolExplorer />

      {/* Testimonials */}
      <section className="px-12 py-[100px] bg-space-raised max-md:px-6">
        <div className="max-w-[1120px] mx-auto">
          <div className="text-center mb-14 reveal">
            <div className="text-xs font-bold tracking-[2.5px] uppercase text-indigo-bright mb-4">Student Stories</div>
            <h2 className="text-[clamp(28px,3.5vw,42px)] font-bold leading-[1.15] tracking-tight text-balance">
              Students are finding their paths.
            </h2>
          </div>
          <div className="grid grid-cols-3 gap-6 max-md:grid-cols-1">
            {[
              { quote: "\"I was stuck between Bio and Public Health. Constella showed me 8 alumni who made that exact switch — and what happened next.\"", author: "Sarah K.", role: "Junior, Biology" },
              { quote: "\"I didn't even know UX Research existed as a career. Now I have a roadmap from someone who started in the same Psych classes I'm in.\"", author: "Marcus T.", role: "Sophomore, Psychology" },
              { quote: "\"Seeing real alumni paths made my major decision feel less like a gamble and more like a choice. That's everything when you're undeclared.\"", author: "Jordan L.", role: "Freshman, Undeclared" },
            ].map((t, i) => (
              <div key={t.author} className="p-7 rounded-xl bg-surface border border-border reveal" style={{ transitionDelay: `${i * 150}ms` }}>
                <div className="flex gap-0.5 mb-3.5 text-sm text-[#F59E0B]">
                  {Array(5).fill(0).map((_, j) => <span key={j}>&#9733;</span>)}
                </div>
                <p className="text-[15px] leading-relaxed mb-[18px]">{t.quote}</p>
                <div className="text-[13px] font-bold">{t.author}</div>
                <div className="text-xs text-text-secondary mt-0.5 font-semibold">{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="px-12 py-[100px] max-md:px-6">
        <div className="max-w-[1120px] mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10 tracking-tight reveal">Your data stays yours.</h2>
          <div className="flex justify-center gap-12 flex-wrap max-md:gap-6">
            {[
              { label: "FERPA Compliant", icon: <path d="M12 2l7 4v6c0 5.25-3.5 8.5-7 10-3.5-1.5-7-4.75-7-10V6l7-4z" /> },
              { label: "Anonymized Data", icon: <><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 4-6 8-6s8 2 8 6" /><line x1="4" y1="4" x2="20" y2="20" strokeOpacity="0.5" /></> },
              { label: "No Real Names Shown", icon: <><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></> },
              { label: "School-Verified Data", icon: <><path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="9" /></> },
            ].map((item, i) => (
              <div key={item.label} className="flex items-center gap-3 text-sm font-semibold text-text-secondary reveal" style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="w-9 h-9 rounded-lg bg-indigo/10 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#5B60E8" strokeWidth="1.5" className="w-[18px] h-[18px]">{item.icon}</svg>
                </div>
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-12 py-[120px] text-center relative overflow-hidden max-md:px-6">
        <div className="absolute w-[600px] h-[600px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle,rgba(62,67,173,0.12)_0%,transparent_70%)] pointer-events-none" />
        <div className="relative z-[1] max-w-[1120px] mx-auto reveal">
          <h2 className="text-[clamp(32px,4vw,48px)] font-bold leading-[1.15] tracking-tight mb-4 text-balance max-w-[640px] mx-auto">
            Every alumnus left a map.<br />Now you can follow it.
          </h2>
          <p className="text-[17px] leading-relaxed text-text-secondary max-w-[600px] mx-auto mb-9">
            Start exploring real alumni paths from your school.
          </p>
          <Link href="/signup" className="inline-flex items-center px-9 py-4 bg-indigo text-white rounded-[10px] text-base font-bold hover:bg-indigo-bright hover:-translate-y-px transition-all">
            Get Started
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border text-center text-[13px] text-text-tertiary">
        &copy; 2026 Constella
      </footer>
    </div>
  );
}
