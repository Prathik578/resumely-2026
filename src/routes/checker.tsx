import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/checker")({
  head: () => ({
    meta: [
      { title: "AI Resume Checker — Resumely" },
      { name: "description", content: "Get instant AI-powered feedback on your resume: ATS score, missing keywords, and recruiter suggestions." },
      { property: "og:title", content: "AI Resume Checker — Resumely" },
      { property: "og:description", content: "ATS score, keyword gaps, and recruiter-style feedback." },
    ],
  }),
  component: Checker,
});

type Analysis = {
  score: number;
  strengths: string[];
  improvements: string[];
  missingKeywords: string[];
  recruiterFeedback: string;
};

const mockAnalyze = (text: string): Analysis => {
  const len = text.trim().length;
  const score = Math.min(95, 55 + Math.floor(len / 80));
  return {
    score,
    strengths: [
      "Clear, concise summary that highlights your value proposition",
      "Quantified achievements in recent experience",
      "Consistent date and formatting conventions",
      "Relevant technical skills surfaced early",
    ],
    improvements: [
      "Lead bullet points with strong action verbs (Led, Shipped, Reduced)",
      "Add measurable outcomes (%, $, time saved) to at least 3 more bullets",
      "Tighten the summary to 2–3 lines focused on impact",
      "Remove generic phrases like 'team player' and 'hard worker'",
    ],
    missingKeywords: ["TypeScript", "CI/CD", "Agile", "Stakeholder management", "REST APIs", "Unit testing"],
    recruiterFeedback:
      "Strong structure overall — ATS parsers will read this cleanly. To stand out to recruiters, lead with outcomes over responsibilities and mirror keywords from the target job description in your skills and experience sections.",
  };
};

function Checker() {
  const [text, setText] = useState("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);

  const onAnalyze = () => {
    if (!text.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setAnalysis(mockAnalyze(text));
      setLoading(false);
    }, 700);
  };

  const onFile = async (file: File) => {
    if (file.type === "text/plain") {
      setText(await file.text());
    } else {
      setText(
        `[${file.name}] uploaded. PDF parsing is not enabled in this MVP — paste your resume text below to analyze.`,
      );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">AI Resume Checker</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Paste your resume to get an ATS score, missing keywords, and recruiter feedback.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Input */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-border p-5">
              <h2 className="font-semibold">Your resume</h2>
              <p className="text-xs text-muted-foreground mt-1">
                Upload a .txt file or paste the text below.
              </p>

              <label className="mt-4 flex items-center justify-center rounded-lg border border-dashed border-border h-24 text-sm text-muted-foreground cursor-pointer hover:bg-secondary/50 transition">
                <input
                  type="file"
                  accept=".txt,.pdf"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) onFile(f);
                  }}
                />
                Click to upload (.txt or .pdf)
              </label>

              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your resume text here..."
                className="mt-4 w-full h-64 rounded-lg border border-border bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
              />

              <button
                onClick={onAnalyze}
                disabled={loading || !text.trim()}
                className="mt-4 w-full inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium bg-foreground text-background hover:bg-foreground/90 transition disabled:opacity-50"
              >
                {loading ? "Analyzing..." : "Analyze Resume"}
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3 space-y-5">
            {!analysis ? (
              <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
                Your AI-powered analysis will appear here.
              </div>
            ) : (
              <>
                {/* Score */}
                <div className="rounded-xl border border-border p-6 flex items-center gap-6">
                  <div className="relative h-24 w-24 shrink-0">
                    <svg viewBox="0 0 36 36" className="h-24 w-24 -rotate-90">
                      <circle cx="18" cy="18" r="16" fill="none" stroke="hsl(var(--border, 220 13% 91%))" strokeWidth="3" className="text-border" />
                      <circle
                        cx="18"
                        cy="18"
                        r="16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeDasharray={`${(analysis.score / 100) * 100.5} 100.5`}
                        strokeLinecap="round"
                        className="text-foreground"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-xl font-semibold">
                      {analysis.score}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">ATS Score</div>
                    <div className="text-lg font-semibold mt-0.5">
                      {analysis.score >= 80 ? "Strong" : analysis.score >= 65 ? "Good, with room to improve" : "Needs work"}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Based on structure, keyword coverage, and clarity.
                    </p>
                  </div>
                </div>

                {/* Strengths + Improvements */}
                <div className="grid sm:grid-cols-2 gap-5">
                  <Card title="Resume strengths">
                    <ul className="space-y-2 text-sm">
                      {analysis.strengths.map((s) => (
                        <li key={s} className="flex gap-2">
                          <span className="text-foreground">✓</span>
                          <span className="text-muted-foreground">{s}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                  <Card title="Improvement suggestions">
                    <ul className="space-y-2 text-sm">
                      {analysis.improvements.map((s) => (
                        <li key={s} className="flex gap-2">
                          <span className="text-foreground">→</span>
                          <span className="text-muted-foreground">{s}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                </div>

                {/* Missing keywords */}
                <Card title="Missing keywords">
                  <div className="flex flex-wrap gap-2">
                    {analysis.missingKeywords.map((k) => (
                      <span
                        key={k}
                        className="text-xs px-2.5 py-1 rounded-full bg-secondary text-foreground border border-border"
                      >
                        {k}
                      </span>
                    ))}
                  </div>
                </Card>

                {/* Recruiter feedback */}
                <Card title="Recruiter feedback">
                  <p className="text-sm text-muted-foreground leading-relaxed">{analysis.recruiterFeedback}</p>
                </Card>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border p-5">
      <h3 className="font-semibold text-sm mb-3">{title}</h3>
      {children}
    </div>
  );
}
