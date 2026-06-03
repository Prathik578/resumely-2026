import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/checker")({
  head: () => ({
    meta: [
      { title: "Recruiter Review — Clario" },
      {
        name: "description",
        content:
          "Get a recruiter-style read on your resume: verdict, observed signals, role alignment, and impact rewrites.",
      },
      { property: "og:title", content: "Recruiter Review — Clario" },
      {
        property: "og:description",
        content: "Human-style resume evaluation powered by AI.",
      },
    ],
  }),
  component: Checker,
});

type Role =
  | "Software Engineering"
  | "Data Analysis"
  | "Product Management"
  | "UI/UX Design"
  | "Marketing"
  | "Business Analyst"
  | "Sales"
  | "General Internship";

type Level = "Internship" | "Entry" | "Mid" | "Senior";

type Verdict = "Strong shortlist potential" | "Moderate shortlist potential" | "Needs significant improvement";

type Rewrite = { before: string; after: string };

type Analysis = {
  verdict: Verdict;
  firstImpression: string;
  hiringConfidence: number; // 0-100
  readability: "High" | "Moderate" | "Low";
  atsCompatibility: "Strong" | "Acceptable" | "At risk";
  strengths: string[];
  concerns: string[];
  observedSignals: string[];
  roleAlignment: { label: string; note: string }[];
  rewrites: Rewrite[];
  targetRole: { primary: string; secondary: string[]; confidence: "High" | "Medium" | "Low" };
};

const ROLES: Role[] = [
  "Software Engineering",
  "Data Analysis",
  "Product Management",
  "UI/UX Design",
  "Marketing",
  "Business Analyst",
  "Sales",
  "General Internship",
];

const LEVELS: Level[] = ["Internship", "Entry", "Mid", "Senior"];

const LOADING_STEPS = [
  "Analyzing resume clarity",
  "Evaluating recruiter readability",
  "Reviewing role alignment",
  "Checking achievement impact",
  "Assessing communication strength",
  "Drafting recruiter verdict",
];

const roleCriteria: Record<Role, { label: string; note: string }[]> = {
  "Software Engineering": [
    { label: "Technical clarity", note: "Are stack choices and engineering ownership easy to identify?" },
    { label: "Project impact", note: "Do projects show measurable outcomes, not just tasks?" },
    { label: "Stack relevance", note: "Do the technologies match what's typical for the target role?" },
  ],
  "Data Analysis": [
    { label: "Analytical depth", note: "Does the resume show real analysis, not just tool lists?" },
    { label: "Business impact", note: "Are insights tied to decisions, metrics, or outcomes?" },
    { label: "Tooling fit", note: "Are SQL, Python, BI tools surfaced where they belong?" },
  ],
  "Product Management": [
    { label: "Metrics & outcomes", note: "Does each role connect to business metrics?" },
    { label: "Leadership & influence", note: "Is cross-functional ownership clear without buzzwords?" },
    { label: "Prioritization", note: "Are tradeoffs and decisions visible?" },
  ],
  "UI/UX Design": [
    { label: "Storytelling", note: "Does work read as a narrative, not a feature list?" },
    { label: "Presentation clarity", note: "Are problem, process, and outcome easy to follow?" },
    { label: "Visual communication", note: "Is the resume itself a sample of design thinking?" },
  ],
  Marketing: [
    { label: "Growth metrics", note: "Are campaign results quantified where possible?" },
    { label: "Audience understanding", note: "Is the target customer visible in the work?" },
    { label: "Channel fit", note: "Do channels match the target role's expectations?" },
  ],
  "Business Analyst": [
    { label: "Problem framing", note: "Is the business question clear before the solution?" },
    { label: "Stakeholder context", note: "Is collaboration with stakeholders specific, not vague?" },
    { label: "Outcome clarity", note: "Are recommendations tied to decisions or savings?" },
  ],
  Sales: [
    { label: "Quota & outcomes", note: "Are numbers — quota, attainment, deal sizes — visible?" },
    { label: "Pipeline ownership", note: "Is the sales motion (inbound, outbound, expansion) clear?" },
    { label: "Customer narrative", note: "Do wins read as customer stories, not feature dumps?" },
  ],
  "General Internship": [
    { label: "Initiative", note: "Do projects show curiosity beyond coursework?" },
    { label: "Communication", note: "Is the resume readable and confidently written?" },
    { label: "Relevant exposure", note: "Are skills tied to small but real applications?" },
  ],
};

function isLikelyResume(text: string): boolean {
  const t = text.trim();
  if (t.length < 120) return false;
  const lower = t.toLowerCase();

  const profileSignals = [
    /\b[\w.+-]+@[\w-]+\.[\w.-]+\b/, // email
    /(\+?\d[\d\s().-]{7,}\d)/, // phone
    /linkedin\.com\/in\//i,
    /github\.com\//i,
    /\bcurriculum vitae\b|\bresume\b|\bcv\b/i,
  ];

  const sectionKeywords = [
    "experience", "work experience", "professional experience", "employment",
    "education", "academic", "university", "college", "bachelor", "master", "b.tech", "m.tech", "degree",
    "projects", "project",
    "skills", "technical skills", "tools", "technologies",
    "internship", "intern",
    "certifications", "certificate",
    "achievements", "awards",
    "summary", "objective", "profile",
    "responsibilities", "responsible for",
  ];

  const dateRange = /\b(19|20)\d{2}\b\s*[-–—to]+\s*((19|20)\d{2}|present|current)/i;
  const monthYear = /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\.?\s+(19|20)\d{2}\b/i;

  const profileHits = profileSignals.filter((r) => r.test(t)).length;
  const sectionHits = sectionKeywords.filter((k) => lower.includes(k)).length;
  const hasDates = dateRange.test(t) || monthYear.test(t);

  // Need at least some recognizable resume sections plus either contact info or dates.
  if (sectionHits >= 3) return true;
  if (sectionHits >= 2 && (profileHits >= 1 || hasDates)) return true;
  if (sectionHits >= 1 && profileHits >= 1 && hasDates) return true;
  return false;
}

function detectJobRelevance(text: string): { ok: boolean; field?: string; role?: string } {
  const lower = text.toLowerCase();
  const fields: { field: string; role: string; keywords: string[] }[] = [
    { field: "Software Engineering", role: "Software Engineer", keywords: ["software", "developer", "engineer", "react", "javascript", "typescript", "python", "java ", "node", "api", "backend", "frontend", "full-stack", "fullstack", "git", "aws", "docker"] },
    { field: "Data / Analytics", role: "Data Analyst / Data Scientist", keywords: ["data analyst", "data scientist", "machine learning", "sql", "tableau", "power bi", "pandas", "numpy", "analytics", "etl"] },
    { field: "Electrical Engineering", role: "Electrical / Hardware Engineer", keywords: ["circuit design", "pcb", "vlsi", "embedded", "microcontroller", "verilog", "matlab", "power systems", "signal processing", "fpga"] },
    { field: "Mechanical Engineering", role: "Mechanical Engineer", keywords: ["cad", "solidworks", "autocad", "ansys", "thermodynamics", "manufacturing", "mechanical design"] },
    { field: "Civil Engineering", role: "Civil Engineer", keywords: ["civil engineer", "structural", "construction", "surveying", "staad", "revit"] },
    { field: "Finance", role: "Finance / Analyst", keywords: ["finance", "accounting", "audit", "investment", "valuation", "financial model", "excel", "cfa", "banking", "equity"] },
    { field: "Marketing", role: "Marketing / Growth", keywords: ["marketing", "seo", "sem", "campaign", "brand", "content strategy", "social media", "growth", "google ads"] },
    { field: "Sales", role: "Sales Representative", keywords: ["sales", "quota", "pipeline", "crm", "salesforce", "lead generation", "account executive"] },
    { field: "Product Management", role: "Product Manager", keywords: ["product manager", "product management", "roadmap", "stakeholder", "user research", "prd"] },
    { field: "Design", role: "UI/UX Designer", keywords: ["ui/ux", "ux design", "figma", "sketch", "wireframe", "prototype", "user experience", "interaction design"] },
    { field: "Human Resources", role: "HR / Recruiter", keywords: ["human resources", "recruit", "talent acquisition", "onboarding", "payroll", "hrbp"] },
    { field: "Operations", role: "Operations / Supply Chain", keywords: ["operations", "supply chain", "logistics", "procurement", "inventory", "six sigma"] },
    { field: "Healthcare", role: "Healthcare Professional", keywords: ["nurse", "patient care", "clinical", "hospital", "medical", "pharmacy", "physician"] },
    { field: "Education", role: "Educator / Teacher", keywords: ["teacher", "teaching", "curriculum", "classroom", "lesson plan", "tutor"] },
    { field: "Legal", role: "Legal Professional", keywords: ["legal", "law firm", "litigation", "paralegal", "contracts", "compliance"] },
  ];

  let best = { field: "", role: "", hits: 0 };
  for (const f of fields) {
    const hits = f.keywords.filter((k) => lower.includes(k)).length;
    if (hits > best.hits) best = { field: f.field, role: f.role, hits };
  }

  const jobIntent = /(intern|internship|seeking|looking for|career|position|role|employment|opportunit)/i.test(text);

  if (best.hits >= 2 || (best.hits >= 1 && jobIntent)) {
    return { ok: true, field: best.field, role: best.role };
  }
  return { ok: false };
}

type RoleExtraction = {
  primary: string;
  secondary: string[];
  confidence: "High" | "Medium" | "Low";
};

function extractTargetRole(text: string): RoleExtraction {
  const lower = text.toLowerCase();

  // Explicit role mention in summary/objective
  const explicit = text.match(
    /(?:seeking|looking for|aspiring|target(?:ing)?|applying for|position as|role as|career as|objective[:\s-]+)\s*(?:an?\s+|the\s+)?([A-Z][A-Za-z/&\s-]{3,40}?)(?:\s+(?:role|position|internship|intern|job|opportunit|at|with|in)|[.,\n])/i,
  );

  const roleScores: { role: string; score: number }[] = [
    { role: "Software Engineer", score: count(lower, ["software engineer", "software developer", "swe", "full-stack", "fullstack", "backend developer", "frontend developer", "react", "node.js", "typescript", "javascript", "api", "git"]) },
    { role: "Data Scientist", score: count(lower, ["data scientist", "machine learning", "deep learning", "tensorflow", "pytorch", "nlp", "model training"]) },
    { role: "Data Analyst", score: count(lower, ["data analyst", "sql", "tableau", "power bi", "excel", "dashboard", "analytics", "etl"]) },
    { role: "Product Manager", score: count(lower, ["product manager", "product management", "roadmap", "prd", "user research", "stakeholder"]) },
    { role: "UI/UX Designer", score: count(lower, ["ui/ux", "ux designer", "ui designer", "figma", "sketch", "wireframe", "prototype", "user experience"]) },
    { role: "Marketing Specialist", score: count(lower, ["marketing", "seo", "sem", "campaign", "brand", "social media", "google ads", "content strategy"]) },
    { role: "Sales Representative", score: count(lower, ["sales", "quota", "pipeline", "crm", "salesforce", "lead generation", "account executive"]) },
    { role: "Business Analyst", score: count(lower, ["business analyst", "requirements gathering", "stakeholder", "process improvement", "jira"]) },
    { role: "Financial Analyst", score: count(lower, ["finance", "valuation", "financial model", "investment", "equity", "cfa", "banking"]) },
    { role: "Electrical Engineer", score: count(lower, ["circuit", "pcb", "vlsi", "embedded", "microcontroller", "verilog", "fpga", "power systems"]) },
    { role: "Mechanical Engineer", score: count(lower, ["cad", "solidworks", "autocad", "ansys", "thermodynamics", "mechanical design"]) },
    { role: "Civil Engineer", score: count(lower, ["structural", "construction", "surveying", "staad", "revit", "civil"]) },
    { role: "HR / Recruiter", score: count(lower, ["human resources", "recruit", "talent acquisition", "onboarding", "hrbp"]) },
    { role: "Operations / Supply Chain", score: count(lower, ["supply chain", "logistics", "procurement", "inventory", "six sigma", "operations"]) },
    { role: "Healthcare Professional", score: count(lower, ["nurse", "patient care", "clinical", "hospital", "medical", "physician"]) },
  ];

  const ranked = roleScores.filter((r) => r.score > 0).sort((a, b) => b.score - a.score);
  const top = ranked[0];
  const explicitRole = explicit?.[1]?.trim();

  let primary = explicitRole || top?.role || "Unspecified Role";
  // Normalize title casing for explicit
  if (explicitRole) {
    primary = explicitRole.replace(/\s+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  }

  const secondary = ranked
    .slice(explicitRole ? 0 : 1, explicitRole ? 2 : 3)
    .filter((r) => r.role !== primary)
    .map((r) => r.role);

  let confidence: RoleExtraction["confidence"] = "Low";
  if (explicitRole && top && top.score >= 2) confidence = "High";
  else if (explicitRole) confidence = "Medium";
  else if (top && top.score >= 4) confidence = "High";
  else if (top && top.score >= 2) confidence = "Medium";

  return { primary, secondary, confidence };
}

function count(text: string, keywords: string[]): number {
  return keywords.reduce((n, k) => (text.includes(k) ? n + 1 : n), 0);
}

function mockAnalyze(text: string, role: Role, level: Level): Analysis {
  const raw = text.trim();
  const len = raw.length;
  const lower = raw.toLowerCase();

  // Heuristic signals
  const hasNumbers = /\d+%|\$\d|\d+\s*(users|customers|requests|hours|days|weeks|months|x)/i.test(raw);
  const taskHeavy = /(responsible for|worked on|helped with|assisted in|involved in)/i.test(raw);
  const buzzwords = /(synergy|leverag(ed|ing)|spearhead|results-driven|dynamic professional)/i.test(raw);
  const tooShort = len < 600;
  const tooLong = len > 6000;

  // Confidence calc
  let confidence = 55;
  if (len > 800) confidence += 8;
  if (len > 1800) confidence += 6;
  if (hasNumbers) confidence += 12;
  if (!taskHeavy) confidence += 6;
  if (!buzzwords) confidence += 4;
  if (level === "Senior") confidence -= 3;
  confidence = Math.max(28, Math.min(92, confidence));

  const verdict: Verdict =
    confidence >= 75 ? "Strong shortlist potential" : confidence >= 58 ? "Moderate shortlist potential" : "Needs significant improvement";

  const readability: Analysis["readability"] = tooLong ? "Moderate" : tooShort ? "Low" : "High";
  const atsCompatibility: Analysis["atsCompatibility"] = tooShort ? "At risk" : "Acceptable";

  const firstImpression =
    verdict === "Strong shortlist potential"
      ? `A recruiter scanning this for a ${level.toLowerCase()} ${role} role may form a confident first impression — the background reads as relevant and the structure supports a fast scan.`
      : verdict === "Moderate shortlist potential"
        ? `A recruiter reviewing this for a ${level.toLowerCase()} ${role} role may see relevant background, but ownership and measurable impact aren't easy to spot in a 30-second skim.`
        : `A recruiter reviewing this for a ${level.toLowerCase()} ${role} role may struggle to quickly identify your strongest signal — the resume reads more as a list of activities than a story of impact.`;

  const strengths = [
    !taskHeavy && "Bullets lean toward action over passive responsibility language.",
    hasNumbers && "Some achievements include numbers, which recruiters anchor on quickly.",
    !buzzwords && "Writing avoids the most common corporate filler phrases.",
    len > 1200 && "Resume has enough substance to evaluate seriously.",
  ].filter(Boolean) as string[];

  const concerns = [
    taskHeavy && "Several bullets describe responsibilities rather than outcomes.",
    !hasNumbers && "Few measurable results (numbers, %, scale) are visible.",
    buzzwords && "Some phrasing leans on corporate buzzwords that recruiters tend to skim past.",
    tooShort && "Resume is short — recruiters may not have enough to evaluate fit.",
    tooLong && "Resume is dense — key signals risk getting lost in a 30-second read.",
  ].filter(Boolean) as string[];

  const observedSignals = [
    taskHeavy
      ? "Most bullet points describe responsibilities rather than outcomes."
      : "Most bullet points lead with an action verb rather than a passive description.",
    hasNumbers
      ? "Quantified results appear in multiple places, anchoring the reader."
      : "Projects and roles lack measurable impact metrics.",
    `Technical skills are ${hasNumbers ? "" : "not consistently "}contextualized inside achievements.`,
    `Summary tone reads as ${buzzwords ? "generic and buzzword-heavy" : "direct and role-appropriate"} for ${role}.`,
    lower.includes("intern") && level !== "Internship"
      ? "Internship experience is foregrounded for a non-internship target — consider reordering."
      : "Section ordering is consistent with the target experience level.",
  ];

  const rewrites: Rewrite[] = [
    {
      before: "Worked on frontend development for the company website.",
      after:
        "Built responsive frontend features in React that improved mobile usability and reduced page-load friction for visitors.",
    },
    {
      before: "Responsible for analyzing customer data and creating reports.",
      after:
        "Turned customer behavior data into weekly reports that informed retention experiments and prioritization decisions.",
    },
    {
      before: "Helped the marketing team with campaigns.",
      after:
        "Partnered with marketing to ship campaigns end-to-end — owning copy, segmentation, and post-launch reporting.",
    },
  ];

  return {
    verdict,
    firstImpression,
    hiringConfidence: confidence,
    readability,
    atsCompatibility,
    strengths: strengths.length ? strengths : ["Resume has a clear, readable structure."],
    concerns: concerns.length ? concerns : ["No critical concerns detected — refine for role specificity."],
    observedSignals,
    roleAlignment: roleCriteria[role],
    rewrites,
  };
}

function Checker() {
  const [text, setText] = useState("");
  const [role, setRole] = useState<Role>("Software Engineering");
  const [level, setLevel] = useState<Level>("Entry");
  const [industry, setIndustry] = useState("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [invalidMessage, setInvalidMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  useEffect(() => {
    if (!loading) return;
    setLoadingStep(0);
    const interval = setInterval(() => {
      setLoadingStep((s) => Math.min(s + 1, LOADING_STEPS.length - 1));
    }, 450);
    return () => clearInterval(interval);
  }, [loading]);

  const onAnalyze = () => {
    if (!text.trim()) return;
    if (!isLikelyResume(text)) {
      setAnalysis(null);
      setLoading(false);
      setInvalidMessage(
        "Invalid Input: Please provide a resume or job-related career document for analysis.",
      );
      return;
    }
    const relevance = detectJobRelevance(text);
    if (!relevance.ok) {
      setAnalysis(null);
      setLoading(false);
      setInvalidMessage(
        "This resume does not appear to target a specific job role. Please provide a job-oriented resume.",
      );
      return;
    }
    setInvalidMessage(null);
    setLoading(true);
    setAnalysis(null);
    setTimeout(() => {
      setAnalysis(mockAnalyze(text, role, level));
      setLoading(false);
    }, LOADING_STEPS.length * 450 + 200);
  };

  const onFile = async (file: File) => {
    if (file.type === "text/plain") {
      setText(await file.text());
    } else {
      setText(
        `[${file.name}] uploaded. PDF parsing isn't enabled yet — paste your resume text below to run the recruiter review.`,
      );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
            Recruiter Review
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">
            See how a recruiter may read your resume
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Paste your resume and choose your target role. We'll simulate a recruiter-style read —
            verdict, observed signals, role alignment, and concrete rewrites.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Input */}
          <div className="lg:col-span-2 space-y-5">
            <div className="rounded-xl border border-border p-5">
              <h2 className="font-semibold">Target role</h2>
              <p className="text-xs text-muted-foreground mt-1">
                The review adapts criteria to the role and level you select.
              </p>

              <label className="block mt-4 text-xs font-medium text-foreground">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>

              <label className="block mt-3 text-xs font-medium text-foreground">Experience level</label>
              <div className="mt-1 grid grid-cols-4 gap-1.5">
                {LEVELS.map((l) => (
                  <button
                    key={l}
                    onClick={() => setLevel(l)}
                    className={`text-xs px-2 py-1.5 rounded-md border transition ${
                      level === l
                        ? "bg-foreground text-background border-foreground"
                        : "border-border text-foreground hover:bg-secondary"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>

              <label className="block mt-3 text-xs font-medium text-foreground">
                Industry <span className="text-muted-foreground font-normal">(optional)</span>
              </label>
              <input
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="e.g. Fintech, Healthcare, SaaS"
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
              />
            </div>

            <div className="rounded-xl border border-border p-5">
              <h2 className="font-semibold">Your resume</h2>
              <p className="text-xs text-muted-foreground mt-1">
                Upload a .txt file or paste the text below.
              </p>

              <label className="mt-4 flex items-center justify-center rounded-lg border border-dashed border-border h-20 text-sm text-muted-foreground cursor-pointer hover:bg-secondary/50 transition">
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
                className="mt-4 w-full h-56 rounded-lg border border-border bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
              />

              <button
                onClick={onAnalyze}
                disabled={loading || !text.trim()}
                className="mt-4 w-full inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium bg-foreground text-background hover:bg-foreground/90 transition disabled:opacity-50"
              >
                {loading ? "Running recruiter review…" : "Run Recruiter Review"}
              </button>
              <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
                AI feedback is designed to simulate recruiter-style evaluation and should be used
                as guidance, not as a guarantee of hiring outcomes.
              </p>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3 space-y-5">
            {invalidMessage ? (
              <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-6">
                <div className="text-xs uppercase tracking-wider text-destructive">
                  Invalid input
                </div>
                <p className="mt-2 text-sm text-foreground">{invalidMessage}</p>
              </div>
            ) : loading ? (
              <div className="rounded-xl border border-border p-8">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">
                  Recruiter review in progress
                </div>
                <div className="mt-4 space-y-2.5">
                  {LOADING_STEPS.map((step, i) => {
                    const state =
                      i < loadingStep ? "done" : i === loadingStep ? "active" : "todo";
                    return (
                      <div key={step} className="flex items-center gap-3 text-sm">
                        <span
                          className={`h-2 w-2 rounded-full ${
                            state === "done"
                              ? "bg-foreground"
                              : state === "active"
                                ? "bg-foreground animate-pulse"
                                : "bg-border"
                          }`}
                        />
                        <span
                          className={
                            state === "todo"
                              ? "text-muted-foreground"
                              : state === "active"
                                ? "text-foreground"
                                : "text-muted-foreground line-through"
                          }
                        >
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : !analysis ? (
              <div className="rounded-xl border border-dashed border-border p-10 text-center">
                <div className="text-sm font-medium">Your recruiter review will appear here</div>
                <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
                  You'll see a verdict, first-impression read, observed signals, role alignment,
                  and rewrite suggestions for weaker bullets.
                </p>
              </div>
            ) : (
              <>
                {/* Verdict */}
                <div className="rounded-xl border border-border p-6">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">
                    Recruiter Verdict
                  </div>
                  <div className="mt-2 flex flex-wrap items-baseline justify-between gap-3">
                    <div className="text-2xl font-semibold tracking-tight">{analysis.verdict}</div>
                    <div className="text-sm text-muted-foreground">
                      Hiring confidence:{" "}
                      <span className="text-foreground font-medium">{analysis.hiringConfidence}/100</span>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    {analysis.firstImpression}
                  </p>
                  <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
                    <Pill label="Readability" value={analysis.readability} />
                    <Pill label="ATS compatibility" value={analysis.atsCompatibility} />
                  </div>
                </div>

                {/* Strengths + Concerns */}
                <div className="grid sm:grid-cols-2 gap-5">
                  <Card title="Strongest strengths">
                    <ul className="space-y-2 text-sm">
                      {analysis.strengths.map((s) => (
                        <li key={s} className="flex gap-2">
                          <span className="text-foreground">✓</span>
                          <span className="text-muted-foreground">{s}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                  <Card title="Biggest concerns">
                    <ul className="space-y-2 text-sm">
                      {analysis.concerns.map((s) => (
                        <li key={s} className="flex gap-2">
                          <span className="text-foreground">!</span>
                          <span className="text-muted-foreground">{s}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                </div>

                {/* Why this feedback */}
                <Card title="Why this feedback — observed signals">
                  <ul className="space-y-2 text-sm">
                    {analysis.observedSignals.map((s) => (
                      <li key={s} className="flex gap-2">
                        <span className="text-muted-foreground">·</span>
                        <span className="text-muted-foreground">{s}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                {/* Role alignment */}
                <Card title={`Role alignment — ${role} (${level})`}>
                  <div className="space-y-3">
                    {analysis.roleAlignment.map((r) => (
                      <div key={r.label} className="border-l-2 border-border pl-3">
                        <div className="text-sm font-medium">{r.label}</div>
                        <div className="text-sm text-muted-foreground mt-0.5">{r.note}</div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Rewrites */}
                <Card title="Impact rewrites — sample improvements">
                  <div className="space-y-4">
                    {analysis.rewrites.map((r, i) => (
                      <div key={i} className="rounded-lg border border-border overflow-hidden">
                        <div className="px-3 py-2 bg-secondary/50 text-xs text-muted-foreground">
                          Before
                        </div>
                        <p className="px-3 py-2 text-sm text-muted-foreground">{r.before}</p>
                        <div className="px-3 py-2 bg-foreground text-background text-xs">
                          Recruiter-readable rewrite
                        </div>
                        <p className="px-3 py-2 text-sm">{r.after}</p>
                      </div>
                    ))}
                    <p className="text-[11px] text-muted-foreground">
                      Review and personalize all AI suggestions before applying. We avoid inventing
                      metrics — fill in real numbers where you have them.
                    </p>
                  </div>
                </Card>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function Pill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border px-3 py-2">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="text-sm font-medium mt-0.5">{value}</div>
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
