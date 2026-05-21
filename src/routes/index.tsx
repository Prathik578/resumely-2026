import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { ResumeForm } from "@/components/ResumeForm";
import { ResumePreview } from "@/components/ResumePreview";
import { emptyResume, exampleResume, ResumeData } from "@/lib/resume-types";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [data, setData] = useState<ResumeData>(emptyResume);
  const [template, setTemplate] = useState<"classic" | "modern">("modern");
  const [downloading, setDownloading] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!previewRef.current) return;
    setDownloading(true);
    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ unit: "in", format: "letter", orientation: "portrait" });
      const pdfWidth = 8.5;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      let heightLeft = pdfHeight;
      let position = 0;
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
      heightLeft -= 11;
      while (heightLeft > 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
        heightLeft -= 11;
      }
      const name = (data.fullName || "resume").replace(/\s+/g, "_");
      pdf.save(`${name}.pdf`);
    } finally {
      setDownloading(false);
    }
  };

  const btn =
    "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition";
  const btnPrimary = `${btn} bg-foreground text-background hover:bg-foreground/90`;
  const btnGhost = `${btn} border border-border text-foreground hover:bg-secondary`;

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-20 bg-background/80 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md bg-foreground text-background flex items-center justify-center text-xs font-bold">
              R
            </div>
            <span className="font-semibold tracking-tight">Resume Builder</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center rounded-lg border border-border p-0.5">
              <button
                onClick={() => setTemplate("modern")}
                className={`px-3 py-1 text-xs font-medium rounded-md transition ${
                  template === "modern"
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Modern
              </button>
              <button
                onClick={() => setTemplate("classic")}
                className={`px-3 py-1 text-xs font-medium rounded-md transition ${
                  template === "classic"
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Classic
              </button>
            </div>
            <button onClick={() => setData(exampleResume)} className={btnGhost}>
              Fill Example
            </button>
            <button onClick={handleDownload} disabled={downloading} className={btnPrimary}>
              {downloading ? "Generating..." : "Download PDF"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div>
            <div className="mb-5">
              <h1 className="text-2xl font-semibold tracking-tight">
                Build your ATS-friendly resume
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Fill in your details. The preview updates instantly.
              </p>
            </div>
            <ResumeForm data={data} setData={setData} />
          </div>

          {/* Preview */}
          <div>
            <div className="lg:sticky lg:top-20">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Live Preview
                </span>
                <span className="text-xs text-muted-foreground">
                  {template === "modern" ? "Modern template" : "Classic template"}
                </span>
              </div>
              <div className="rounded-xl border border-border bg-secondary/40 p-4 overflow-auto max-h-[calc(100vh-9rem)]">
                <ResumePreview ref={previewRef} data={data} template={template} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
