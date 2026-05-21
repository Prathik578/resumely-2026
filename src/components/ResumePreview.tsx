import { forwardRef } from "react";
import { ResumeData } from "@/lib/resume-types";

interface Props {
  data: ResumeData;
  template: "classic" | "modern";
}

const contactItems = (data: ResumeData) =>
  [data.email, data.phone, data.location, data.linkedin, data.github].filter(Boolean);

export const ResumePreview = forwardRef<HTMLDivElement, Props>(function ResumePreview(
  { data, template },
  ref,
) {
  const isModern = template === "modern";

  return (
    <div
      ref={ref}
      className="bg-white text-black mx-auto shadow-sm"
      style={{
        width: "100%",
        maxWidth: "8.5in",
        minHeight: "11in",
        padding: "0.6in 0.7in",
        fontFamily: isModern
          ? "Inter, system-ui, sans-serif"
          : "'Source Serif 4', Georgia, serif",
        fontSize: "10.5pt",
        lineHeight: 1.45,
        color: "#111",
      }}
    >
      {/* Header */}
      <header
        className={isModern ? "border-b border-gray-300 pb-3 mb-4" : "text-center mb-5"}
      >
        <h1
          style={{
            fontSize: isModern ? "22pt" : "24pt",
            fontWeight: 700,
            letterSpacing: isModern ? "-0.01em" : "0.04em",
            textTransform: isModern ? "none" : "uppercase",
            margin: 0,
          }}
        >
          {data.fullName || "Your Name"}
        </h1>
        <div
          style={{
            marginTop: "6px",
            fontSize: "9.5pt",
            color: "#444",
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            justifyContent: isModern ? "flex-start" : "center",
          }}
        >
          {contactItems(data).map((c, i) => (
            <span key={i}>{c}</span>
          ))}
        </div>
      </header>

      <Section title="Summary" isModern={isModern} show={!!data.summary}>
        <p style={{ margin: 0 }}>{data.summary}</p>
      </Section>

      <Section title="Skills" isModern={isModern} show={!!data.skills}>
        <p style={{ margin: 0 }}>{data.skills}</p>
      </Section>

      <Section
        title="Experience"
        isModern={isModern}
        show={data.experience.some((e) => e.company || e.role)}
      >
        {data.experience.map((ex, i) =>
          ex.company || ex.role ? (
            <div key={i} style={{ marginBottom: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                <div style={{ fontWeight: 600 }}>
                  {ex.role}
                  {ex.role && ex.company ? " — " : ""}
                  {ex.company}
                </div>
                <div style={{ color: "#555", fontSize: "9.5pt", whiteSpace: "nowrap" }}>
                  {ex.date}
                </div>
              </div>
              {ex.description && (
                <p style={{ margin: "3px 0 0 0", whiteSpace: "pre-wrap" }}>{ex.description}</p>
              )}
            </div>
          ) : null,
        )}
      </Section>

      <Section
        title="Education"
        isModern={isModern}
        show={data.education.some((e) => e.school || e.degree)}
      >
        {data.education.map((ed, i) =>
          ed.school || ed.degree ? (
            <div key={i} style={{ marginBottom: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                <div style={{ fontWeight: 600 }}>
                  {ed.school}
                  {ed.school && ed.degree ? " — " : ""}
                  {ed.degree}
                </div>
                <div style={{ color: "#555", fontSize: "9.5pt", whiteSpace: "nowrap" }}>
                  {ed.date}
                </div>
              </div>
              {ed.details && <p style={{ margin: "3px 0 0 0" }}>{ed.details}</p>}
            </div>
          ) : null,
        )}
      </Section>

      <Section
        title="Projects"
        isModern={isModern}
        show={data.projects.some((p) => p.name)}
      >
        {data.projects.map((p, i) =>
          p.name ? (
            <div key={i} style={{ marginBottom: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                <div style={{ fontWeight: 600 }}>
                  {p.name}
                  {p.tech ? (
                    <span style={{ fontWeight: 400, color: "#555" }}> — {p.tech}</span>
                  ) : null}
                </div>
                {p.link && (
                  <div style={{ color: "#555", fontSize: "9.5pt", whiteSpace: "nowrap" }}>
                    {p.link}
                  </div>
                )}
              </div>
              {p.description && <p style={{ margin: "3px 0 0 0" }}>{p.description}</p>}
            </div>
          ) : null,
        )}
      </Section>
    </div>
  );
});

function Section({
  title,
  children,
  show,
  isModern,
}: {
  title: string;
  children: React.ReactNode;
  show: boolean;
  isModern: boolean;
}) {
  if (!show) return null;
  return (
    <section style={{ marginBottom: "14px" }}>
      <h2
        style={{
          fontSize: "10.5pt",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          borderBottom: isModern ? "none" : "1px solid #999",
          color: isModern ? "#000" : "#111",
          paddingBottom: isModern ? 0 : "2px",
          marginBottom: "6px",
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}
