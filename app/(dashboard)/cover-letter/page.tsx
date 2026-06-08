"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { resumeService } from "@/services/resumes";
import api from "@/lib/axios";
import { Resume } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FileText, Loader2, Copy, Check } from "lucide-react";

const TONES = ["professional", "creative", "concise"];

export default function CoverLetterPage() {
  const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [tone, setTone] = useState("professional");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [result, setResult] = useState<null | {
    cover_letter: string;
    subject_line: string;
    key_highlights: string[];
  }>(null);

  const { data: resumesData } = useQuery({
    queryKey: ["resumes"],
    queryFn: async () => {
      try {
        const res = await resumeService.getAll();
        return res.data as Resume[];
      } catch {
        return [] as Resume[];
      }
    },
  });

  const resumes = resumesData || [];

  const handleGenerate = async () => {
    if (!selectedResumeId) {
      toast.error("Please select a resume.");
      return;
    }
    if (!jobDescription.trim()) {
      toast.error("Please enter a job description.");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/cover-letter", {
        resume_id: selectedResumeId,
        job_description: jobDescription,
        tone,
      });
      setResult(res.data.data);
      toast.success("Cover letter generated!");
    } catch {
      toast.error("Failed to generate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (result?.cover_letter) {
      navigator.clipboard.writeText(result.cover_letter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Copied to clipboard!");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Cover letter</h1>
        <p className="text-muted-foreground mt-1">
          Generate a tailored cover letter using AI.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Select resume</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {resumes.map((resume) => (
              <div
                key={resume.id}
                onClick={() => setSelectedResumeId(resume.id)}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedResumeId === resume.id
                    ? "border-primary bg-primary/5"
                    : "hover:border-muted-foreground"
                }`}
              >
                <FileText className="h-5 w-5 text-blue-500 shrink-0" />
                <p className="font-medium text-sm truncate">{resume.title}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Job description & tone</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <textarea
            className="w-full min-h-40 p-3 rounded-lg border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary bg-background"
            placeholder="Paste the job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
          <div className="flex gap-2">
            {TONES.map((t) => (
              <button
                key={t}
                onClick={() => setTone(t)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                  tone === t
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-accent"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <Button onClick={handleGenerate} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate cover letter"
            )}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Generated cover letter</CardTitle>
            <Button variant="outline" size="sm" onClick={handleCopy}>
              {copied ? (
                <><Check className="h-4 w-4 mr-2" />Copied!</>
              ) : (
                <><Copy className="h-4 w-4 mr-2" />Copy</>
              )}
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {result.subject_line && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Subject line</p>
                <p className="text-sm font-medium">{result.subject_line}</p>
              </div>
            )}
            <div className="p-4 bg-muted/40 rounded-lg">
              <pre className="text-sm whitespace-pre-wrap font-sans leading-relaxed">
                {result.cover_letter}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}