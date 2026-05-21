import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Resumely — Build Better Resumes with AI" },
      {
        name: "description",
        content:
          "Create ATS-optimized resumes and get instant AI feedback. Free, fast, and built for job seekers.",
      },
      { property: "og:title", content: "Resumely — Build Better Resumes with AI" },
      {
        property: "og:description",
        content: "ATS-friendly resume builder with AI-powered review.",
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
          to="/builder"
          className="hidden sm:inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium bg-foreground text-background hover:bg-foreground/90 transition"
        >
          Get Started
        </Link>
      </SiteHeader>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-24 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground mb-6">
          <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
          AI-powered resume tools for job seekers
        </div>
        <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight max-w-3xl mx-auto leading-[1.05]">
          Build Better Resumes <br className="hidden sm:block" /> with AI
        </h1>
        <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
          Create clean, ATS-optimized resumes in minutes and get instant AI-powered feedback that
          helps you land more interviews.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/builder"
            className="inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium bg-foreground text-background hover:bg-foreground/90 transition"
          >
            Build Resume
          </Link>
          <Link
            to="/checker"
            className="inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium border border-border text-foreground hover:bg-secondary transition"
          >
            Check Resume
          </Link>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">No signup required. Free to try.</p>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 border-t border-border">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold tracking-tight">Everything you need</h2>
          <p className="text-muted-foreground mt-2">
            Three powerful tools to give your job search an edge.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              title: "ATS Optimization",
              desc: "Clean, parser-friendly layouts that get through applicant tracking systems.",
            },
            {
              title: "AI Resume Feedback",
              desc: "Get recruiter-style suggestions, keyword gaps, and improvement tips instantly.",
            },
            {
              title: "Resume Templates",
              desc: "Modern and classic templates designed for technical and non-technical roles.",
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

      {/* Templates */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 border-t border-border">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">Polished templates, ready to ship</h2>
            <p className="text-muted-foreground mt-3">
              Pick between a Modern and Classic template. Both are tuned for readability and ATS
              parsers, with sensible spacing and typography out of the box.
            </p>
            <Link
              to="/builder"
              className="mt-6 inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium bg-foreground text-background hover:bg-foreground/90 transition"
            >
              Try the builder
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {["Modern", "Classic"].map((t) => (
              <div key={t} className="rounded-xl border border-border bg-secondary/40 aspect-[3/4] p-4 flex flex-col">
                <div className="h-3 w-24 bg-foreground rounded" />
                <div className="mt-2 h-2 w-32 bg-muted-foreground/40 rounded" />
                <div className="mt-4 space-y-1.5">
                  <div className="h-1.5 w-full bg-muted-foreground/30 rounded" />
                  <div className="h-1.5 w-5/6 bg-muted-foreground/30 rounded" />
                  <div className="h-1.5 w-4/6 bg-muted-foreground/30 rounded" />
                </div>
                <div className="mt-auto text-xs text-muted-foreground">{t}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing placeholder */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 border-t border-border">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-semibold tracking-tight">Simple pricing</h2>
          <p className="text-muted-foreground mt-2">Start free. Upgrade when you need more.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {[
            { name: "Free", price: "$0", features: ["Resume builder", "PDF export", "1 AI check / day"] },
            { name: "Pro", price: "$9", features: ["Unlimited AI checks", "Premium templates", "Keyword targeting"], highlight: true },
            { name: "Teams", price: "Custom", features: ["Career services", "Bulk reviews", "Priority support"] },
          ].map((p) => (
            <div
              key={p.name}
              className={`rounded-xl border p-6 ${
                p.highlight ? "border-foreground" : "border-border"
              }`}
            >
              <div className="flex items-baseline justify-between">
                <h3 className="font-semibold">{p.name}</h3>
                <div className="text-2xl font-semibold">{p.price}</div>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {p.features.map((f) => (
                  <li key={f}>· {f}</li>
                ))}
              </ul>
              <button
                disabled
                className="mt-6 w-full inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium border border-border text-muted-foreground cursor-not-allowed"
              >
                Coming soon
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16 border-t border-border">
        <h2 className="text-3xl font-semibold tracking-tight text-center">FAQ</h2>
        <div className="mt-8 divide-y divide-border border-y border-border">
          {[
            {
              q: "Is Resumely free?",
              a: "Yes — the builder and PDF export are free. Pro plans add unlimited AI reviews and premium templates.",
            },
            {
              q: "Are the resumes ATS-friendly?",
              a: "Templates use simple, parser-friendly layouts with standard sections and fonts.",
            },
            {
              q: "Do I need an account?",
              a: "No. You can build and download a resume without signing up.",
            },
            {
              q: "How does the AI checker work?",
              a: "It analyzes your resume for ATS readiness, missing keywords, and recruiter-style improvements.",
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
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Resumely. All rights reserved.
          </div>
          <div className="flex items-center gap-5 text-sm text-muted-foreground">
            <Link to="/builder" className="hover:text-foreground">Builder</Link>
            <Link to="/checker" className="hover:text-foreground">AI Checker</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
