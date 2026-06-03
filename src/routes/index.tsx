import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Clario — Recruiter-Style Resume Intelligence" },
      {
        name: "description",
        content:
          "See how recruiters and hiring managers may evaluate your resume before you apply. Human-style AI feedback, role-aware insights, and recruiter verdicts.",
      },
      { property: "og:title", content: "Clario — Recruiter-Style Resume Intelligence" },
      {
        property: "og:description",
        content:
          "Human-style resume evaluation powered by AI. Understand how your resume may actually be perceived.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader>
        <Link
          to="/checker"
          className="hidden sm:inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium bg-foreground text-background hover:bg-foreground/90 transition"
        >
          Try Recruiter Review
        </Link>
      </SiteHeader>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-24 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground mb-6">
          <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
          Recruiter-style resume intelligence
        </div>
        <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight max-w-3xl mx-auto leading-[1.05]">
          See how recruiters may evaluate your resume
          <span className="text-muted-foreground"> — before you apply.</span>
        </h1>
        <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
          Clario simulates how a recruiter or hiring manager may read your resume — surfacing
          clarity, role alignment, and impact gaps that ATS scores miss.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/checker"
            className="inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium bg-foreground text-background hover:bg-foreground/90 transition"
          >
            Get a Recruiter Review
          </Link>
          <Link
            to="/builder"
            className="inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium border border-border text-foreground hover:bg-secondary transition"
          >
            Build a Resume
          </Link>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Guidance, not a guarantee of hiring outcomes. No signup required.
        </p>
      </section>

      {/* What you get */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 border-t border-border">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold tracking-tight">A human-style review, not a keyword score</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            We focus on how your resume actually reads to the people who decide if you get the
            interview.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              title: "Recruiter Verdict",
              desc: "A first-impression summary, shortlist potential, and hiring-manager confidence read.",
            },
            {
              title: "Role-Aware Evaluation",
              desc: "Different criteria for engineering, product, design, marketing, data, sales, and more.",
            },
            {
              title: "Impact Rewrites",
              desc: "Transform task-style bullets into outcome-driven achievements recruiters scan for.",
            },
            {
              title: "Observed Signals",
              desc: "Every conclusion is backed by specific signals the AI noticed in your resume.",
            },
            {
              title: "ATS Compatibility",
              desc: "Still covered — but as a supporting check, not the headline metric.",
            },
            {
              title: "Premium Templates",
              desc: "Clean, recruiter-readable layouts tuned for clarity and professional polish.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-border p-6 hover:border-foreground/40 transition"
            >
              <div className="h-9 w-9 rounded-lg bg-foreground text-background flex items-center justify-center text-sm font-bold mb-4">
                {f.title[0]}
              </div>
              <h3 className="font-semibold">{f.title}</h3>
              <p className="text-sm text-muted-foreground mt-1.5">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 border-t border-border">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold tracking-tight">How the recruiter review works</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { n: "01", t: "Share your resume", d: "Paste your resume text and pick your target role and experience level." },
            { n: "02", t: "Simulated recruiter read", d: "We evaluate clarity, role fit, impact, and communication — the way a recruiter scans in 30 seconds." },
            { n: "03", t: "Verdict + next steps", d: "Get a recruiter verdict, observed signals, and concrete rewrites for weak bullets." },
          ].map((s) => (
            <div key={s.n} className="rounded-xl border border-border p-6">
              <div className="text-xs font-mono text-muted-foreground">{s.n}</div>
              <h3 className="mt-2 font-semibold">{s.t}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Positioning strip */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16 border-t border-border">
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="rounded-xl border border-border p-6">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Most AI tools say</div>
            <p className="mt-2 text-sm text-muted-foreground line-through">
              “ATS score: 74. Missing keywords: React, Agile, leadership.”
            </p>
          </div>
          <div className="rounded-xl border border-foreground p-6 bg-secondary/40">
            <div className="text-xs uppercase tracking-wider text-foreground">Clario says</div>
            <p className="mt-2 text-sm text-foreground">
              “A recruiter scanning this resume may read it as a strong technical background, but
              your project bullets feel task-oriented rather than impact-oriented — making
              ownership hard to spot in 30 seconds.”
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16 border-t border-border">
        <h2 className="text-3xl font-semibold tracking-tight text-center">FAQ</h2>
        <div className="mt-8 divide-y divide-border border-y border-border">
          {[
            {
              q: "Is this another ATS score tool?",
              a: "No. ATS compatibility is checked as a supporting signal, but our focus is how a human recruiter or hiring manager may actually read and judge your resume.",
            },
            {
              q: "Will this guarantee me an interview?",
              a: "No tool can. Clario is designed as guidance — it surfaces how your resume may be perceived so you can decide what to strengthen before applying.",
            },
            {
              q: "Does it support different roles?",
              a: "Yes. Engineering, product, design, marketing, data, business analyst, sales, and general internships each use different evaluation criteria.",
            },
            {
              q: "Do I need an account?",
              a: "No. You can run a recruiter review and build a resume without signing up.",
            },
          ].map((item) => (
            <details key={item.q} className="group py-4">
              <summary className="cursor-pointer list-none flex items-center justify-between text-sm font-medium">
                {item.q}
                <span className="text-muted-foreground group-open:rotate-45 transition">+</span>
              </summary>
              <p className="mt-2 text-sm text-muted-foreground">{item.a}</p>
            </details>
          ))}
        </div>
        <p className="mt-8 text-xs text-muted-foreground text-center max-w-xl mx-auto">
          AI feedback is designed to simulate recruiter-style evaluation and should be used as
          guidance, not as a guarantee of hiring outcomes.
        </p>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Clario. Recruiter-style resume intelligence.
          </div>
          <div className="flex items-center gap-5 text-sm text-muted-foreground">
            <Link to="/builder" className="hover:text-foreground">Builder</Link>
            <Link to="/checker" className="hover:text-foreground">Recruiter Review</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
