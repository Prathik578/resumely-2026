export interface EducationItem {
  school: string;
  degree: string;
  date: string;
  details: string;
}

export interface ExperienceItem {
  company: string;
  role: string;
  date: string;
  description: string;
}

export interface ProjectItem {
  name: string;
  tech: string;
  description: string;
  link: string;
}

export interface ResumeData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  summary: string;
  skills: string;
  education: EducationItem[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
}

export const emptyResume: ResumeData = {
  fullName: "",
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  github: "",
  summary: "",
  skills: "",
  education: [{ school: "", degree: "", date: "", details: "" }],
  experience: [{ company: "", role: "", date: "", description: "" }],
  projects: [{ name: "", tech: "", description: "", link: "" }],
};

export const exampleResume: ResumeData = {
  fullName: "Alex Johnson",
  email: "alex.johnson@email.com",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  linkedin: "linkedin.com/in/alexjohnson",
  github: "github.com/alexjohnson",
  summary:
    "Full-stack software engineer with 4+ years of experience building scalable web applications. Passionate about clean code, performance, and delivering exceptional user experiences.",
  skills:
    "JavaScript, TypeScript, React, Next.js, Node.js, Python, PostgreSQL, AWS, Docker, Git, REST APIs, GraphQL, Tailwind CSS",
  education: [
    {
      school: "University of California, Berkeley",
      degree: "B.S. Computer Science",
      date: "2018 - 2022",
      details: "GPA: 3.8/4.0. Relevant coursework: Data Structures, Algorithms, Distributed Systems.",
    },
  ],
  experience: [
    {
      company: "Acme Corp",
      role: "Senior Software Engineer",
      date: "Jan 2023 - Present",
      description:
        "Led migration of monolithic backend to microservices, reducing latency by 40%. Mentored 3 junior engineers and shipped 5 major features used by 100k+ users.",
    },
    {
      company: "Startup Inc",
      role: "Software Engineer",
      date: "Jun 2022 - Dec 2022",
      description:
        "Built customer-facing dashboard with React and TypeScript. Implemented CI/CD pipeline that reduced deploy time from 30min to 5min.",
    },
  ],
  projects: [
    {
      name: "DevTracker",
      tech: "React, Node.js, PostgreSQL",
      description: "Open-source productivity tool for developers with 2k+ GitHub stars.",
      link: "github.com/alexjohnson/devtracker",
    },
  ],
};
