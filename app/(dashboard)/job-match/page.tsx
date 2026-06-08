"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { resumeService } from "@/services/resumes";
import api from "@/lib/axios";
import { Resume } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Briefcase, FileText, Loader2, CheckCircle, XCircle, Target } from "lucide-react";

export default function JobMatchPage() {
  const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<null | {
    match_score: number;
    matching_skills: string[];
    missing_skills: string[];
    recommendations: string[];
    suitability: string;
  }>(null);
  const [loading, setLoading] = useState(false);

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

  const handleMatch = async () => {
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
      const res = await api.post("/job-match", {
        resume_id: selectedResumeId,
        job_description: jobDescription,
      });
      setResult(res.data.data);
      toast.success("Match complete!");
    } catch {
      toast.error("Failed to match. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBg = (score: number) => {
    if (score >= 70) return "bg-green-100";
    if (score >= 50) return "bg-yellow-100";
    return "bg-red-100";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Job match</h1>
        <p className="text-muted-foreground mt-1">
          Match your resume against a job description.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Select resume</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
          <CardTitle className="text-base">Paste job description</CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            className="w-full min-h-48 p-3 rounded-lg border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary bg-background"
            placeholder="Paste the full job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
          <Button
            className="mt-4"
            onClick={handleMatch}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Matching...
              </>
            ) : (
              <>
                <Briefcase className="h-4 w-4 mr-2" />
                Match resume
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardContent className="pt-6 space-y-6">
            {/* Score */}
            <div className="flex items-center gap-4">
              <div className={`h-20 w-20 rounded-full flex items-center justify-center ${getScoreBg(result.match_score)}`}>
                <span className={`text-2xl font-bold ${getScoreColor(result.match_score)}`}>
                  {result.match_score}%
                </span>
              </div>
              <div>
                <p className="font-semibold text-lg">Match score</p>
                <Badge className={`mt-1 ${
                  result.suitability === "high"
                    ? "bg-green-100 text-green-800"
                    : result.suitability === "medium"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}>
                  {result.suitability} suitability
                </Badge>
              </div>
            </div>

            {/* Matching skills */}
            {result.matching_skills.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="font-medium text-sm">Matching skills</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.matching_skills.map((s, i) => (
                    <Badge key={i} className="bg-green-100 text-green-800 text-xs">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Missing skills */}
            {result.missing_skills.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span className="font-medium text-sm">Missing skills</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.missing_skills.map((s, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {result.recommendations.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-blue-500" />
                  <span className="font-medium text-sm">Recommendations</span>
                </div>
                <ul className="space-y-1">
                  {result.recommendations.map((r, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex gap-2">
                      <span className="text-blue-500 shrink-0">•</span>
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}