import { ResumeData, EducationItem, ExperienceItem, ProjectItem } from "@/lib/resume-types";

interface Props {
  data: ResumeData;
  setData: (d: ResumeData) => void;
}

const inputCls =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/30 transition";
const labelCls = "block text-xs font-medium text-muted-foreground mb-1.5";
const sectionTitle =
  "text-sm font-semibold text-foreground uppercase tracking-wider mb-4";
const card = "rounded-xl border border-border bg-card p-5 space-y-4";
const smallBtn =
  "text-xs font-medium text-muted-foreground hover:text-foreground transition";

export function ResumeForm({ data, setData }: Props) {
  const update = <K extends keyof ResumeData>(key: K, value: ResumeData[K]) =>
    setData({ ...data, [key]: value });

  const updateArr = <T,>(
    key: "education" | "experience" | "projects",
    idx: number,
    field: string,
    value: string,
  ) => {
    const arr = [...(data[key] as T[])];
    (arr[idx] as Record<string, string>)[field] = value;
    setData({ ...data, [key]: arr });
  };

  const addItem = (key: "education" | "experience" | "projects") => {
    const blanks = {
      education: { school: "", degree: "", date: "", details: "" },
      experience: { company: "", role: "", date: "", description: "" },
      projects: { name: "", tech: "", description: "", link: "" },
    };
    setData({ ...data, [key]: [...(data[key] as unknown[]), blanks[key]] });
  };

  const removeItem = (key: "education" | "experience" | "projects", idx: number) => {
    const arr = [...(data[key] as unknown[])];
    arr.splice(idx, 1);
    setData({ ...data, [key]: arr });
  };

  return (
    <div className="space-y-6">
      {/* Personal */}
      <div className={card}>
        <h3 className={sectionTitle}>Personal Info</h3>
        <div>
          <label className={labelCls}>Full Name</label>
          <input
            className={inputCls}
            value={data.fullName}
            onChange={(e) => update("fullName", e.target.value)}
            placeholder="Jane Doe"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Email</label>
            <input
              className={inputCls}
              value={data.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="jane@email.com"
            />
          </div>
          <div>
            <label className={labelCls}>Phone</label>
            <input
              className={inputCls}
              value={data.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="+1 555 000 0000"
            />
          </div>
          <div>
            <label className={labelCls}>Location</label>
            <input
              className={inputCls}
              value={data.location}
              onChange={(e) => update("location", e.target.value)}
              placeholder="City, Country"
            />
          </div>
          <div>
            <label className={labelCls}>LinkedIn</label>
            <input
              className={inputCls}
              value={data.linkedin}
              onChange={(e) => update("linkedin", e.target.value)}
              placeholder="linkedin.com/in/username"
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>GitHub</label>
            <input
              className={inputCls}
              value={data.github}
              onChange={(e) => update("github", e.target.value)}
              placeholder="github.com/username"
            />
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className={card}>
        <h3 className={sectionTitle}>Professional Summary</h3>
        <textarea
          className={inputCls + " min-h-[100px] resize-y"}
          value={data.summary}
          onChange={(e) => update("summary", e.target.value)}
          placeholder="A short overview of your experience and strengths."
        />
      </div>

      {/* Skills */}
      <div className={card}>
        <h3 className={sectionTitle}>Skills</h3>
        <textarea
          className={inputCls + " min-h-[80px] resize-y"}
          value={data.skills}
          onChange={(e) => update("skills", e.target.value)}
          placeholder="Comma-separated, e.g. JavaScript, React, Node.js"
        />
      </div>

      {/* Education */}
      <div className={card}>
        <div className="flex items-center justify-between mb-2">
          <h3 className={sectionTitle + " mb-0"}>Education</h3>
          <button onClick={() => addItem("education")} className={smallBtn}>
            + Add
          </button>
        </div>
        {data.education.map((ed: EducationItem, i: number) => (
          <div key={i} className="space-y-3 pb-4 border-b border-border last:border-0 last:pb-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                className={inputCls}
                placeholder="School"
                value={ed.school}
                onChange={(e) => updateArr("education", i, "school", e.target.value)}
              />
              <input
                className={inputCls}
                placeholder="Degree"
                value={ed.degree}
                onChange={(e) => updateArr("education", i, "degree", e.target.value)}
              />
              <input
                className={inputCls + " sm:col-span-2"}
                placeholder="Dates (e.g. 2020 - 2024)"
                value={ed.date}
                onChange={(e) => updateArr("education", i, "date", e.target.value)}
              />
            </div>
            <textarea
              className={inputCls + " min-h-[60px] resize-y"}
              placeholder="Details (GPA, coursework, honors)"
              value={ed.details}
              onChange={(e) => updateArr("education", i, "details", e.target.value)}
            />
            {data.education.length > 1 && (
              <button onClick={() => removeItem("education", i)} className={smallBtn}>
                Remove
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Experience */}
      <div className={card}>
        <div className="flex items-center justify-between mb-2">
          <h3 className={sectionTitle + " mb-0"}>Experience</h3>
          <button onClick={() => addItem("experience")} className={smallBtn}>
            + Add
          </button>
        </div>
        {data.experience.map((ex: ExperienceItem, i: number) => (
          <div key={i} className="space-y-3 pb-4 border-b border-border last:border-0 last:pb-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                className={inputCls}
                placeholder="Company"
                value={ex.company}
                onChange={(e) => updateArr("experience", i, "company", e.target.value)}
              />
              <input
                className={inputCls}
                placeholder="Role"
                value={ex.role}
                onChange={(e) => updateArr("experience", i, "role", e.target.value)}
              />
              <input
                className={inputCls + " sm:col-span-2"}
                placeholder="Dates"
                value={ex.date}
                onChange={(e) => updateArr("experience", i, "date", e.target.value)}
              />
            </div>
            <textarea
              className={inputCls + " min-h-[80px] resize-y"}
              placeholder="Achievements and responsibilities"
              value={ex.description}
              onChange={(e) => updateArr("experience", i, "description", e.target.value)}
            />
            {data.experience.length > 1 && (
              <button onClick={() => removeItem("experience", i)} className={smallBtn}>
                Remove
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Projects */}
      <div className={card}>
        <div className="flex items-center justify-between mb-2">
          <h3 className={sectionTitle + " mb-0"}>Projects</h3>
          <button onClick={() => addItem("projects")} className={smallBtn}>
            + Add
          </button>
        </div>
        {data.projects.map((p: ProjectItem, i: number) => (
          <div key={i} className="space-y-3 pb-4 border-b border-border last:border-0 last:pb-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                className={inputCls}
                placeholder="Project name"
                value={p.name}
                onChange={(e) => updateArr("projects", i, "name", e.target.value)}
              />
              <input
                className={inputCls}
                placeholder="Tech used"
                value={p.tech}
                onChange={(e) => updateArr("projects", i, "tech", e.target.value)}
              />
              <input
                className={inputCls + " sm:col-span-2"}
                placeholder="Link (optional)"
                value={p.link}
                onChange={(e) => updateArr("projects", i, "link", e.target.value)}
              />
            </div>
            <textarea
              className={inputCls + " min-h-[60px] resize-y"}
              placeholder="Short description"
              value={p.description}
              onChange={(e) => updateArr("projects", i, "description", e.target.value)}
            />
            {data.projects.length > 1 && (
              <button onClick={() => removeItem("projects", i)} className={smallBtn}>
                Remove
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
