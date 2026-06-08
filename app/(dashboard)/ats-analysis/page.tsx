"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { resumeService } from "@/services/resumes";
import api from "@/lib/axios";
import { Resume, ResumeAnalysis } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Target,
  FileText,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function AtsAnalysisPage() {
  const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

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

  const { data: analysesData, isLoading } = useQuery({
    queryKey: ["analyses"],
    queryFn: async () => {
      try {
        const res = await api.get("/analyses");
        return res.data.data as ResumeAnalysis[];
      } catch {
        return [] as ResumeAnalysis[];
      }
    },
    refetchInterval: 5000,
  });

  const resumes = resumesData || [];
  const analyses = analysesData || [];

  const analyzeMutation = useMutation({
    mutationFn: async (resumeId: number) => {
      const res = await api.post("/analyses", { resume_id: resumeId });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Analysis started! Results will appear in a few seconds.");
    },
    onError: () => toast.error("Failed to start analysis."),
  });

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

  const getScoreLabel = (score: number) => {
    if (score >= 70) return "Good";
    if (score >= 50) return "Average";
    return "Needs Work";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">ATS analysis</h1>
        <p className="text-muted-foreground mt-1">
          Analyze your resume against ATS systems and get a score.
        </p>
      </div>

      {/* Analyze card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Analyze a resume</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {resumes.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No resumes found. Please upload a resume first.
            </p>
          ) : (
            <>
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
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{resume.title}</p>
                      {resume.is_primary && (
                        <Badge className="bg-green-100 text-green-800 text-xs mt-1">
                          Primary
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <Button
                onClick={() => {
                  if (!selectedResumeId) {
                    toast.error("Please select a resume first.");
                    return;
                  }
                  analyzeMutation.mutate(selectedResumeId);
                }}
                disabled={analyzeMutation.isPending || !selectedResumeId}
              >
                {analyzeMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Target className="h-4 w-4 mr-2" />
                    Analyze resume
                  </>
                )}
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Analysis results */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Previous analyses</h2>

        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading...
          </div>
        ) : analyses.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Target className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="font-medium">No analyses yet</p>
            <p className="text-sm">Select a resume and click Analyze</p>
          </div>
        ) : (
          analyses.map((analysis) => (
            <Card key={analysis.id}>
              <CardContent className="p-4">
                {/* Top row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Score circle */}
                    <div className={`h-14 w-14 rounded-full flex items-center justify-center ${getScoreBg(analysis.ats_score)}`}>
                      <span className={`text-lg font-bold ${getScoreColor(analysis.ats_score)}`}>
                        {analysis.status === "pending" ? "..." : analysis.ats_score}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">
                        {analysis.resume?.title || "Resume"}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        {analysis.status === "pending" && (
                          <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                            Processing
                          </Badge>
                        )}
                        {analysis.status === "completed" && (
                          <Badge className="bg-green-100 text-green-800 text-xs">
                            {getScoreLabel(analysis.ats_score)}
                          </Badge>
                        )}
                        {analysis.status === "failed" && (
                          <Badge className="bg-red-100 text-red-800 text-xs">
                            Failed
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {new Date(analysis.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {analysis.status === "completed" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setExpandedId(
                          expandedId === analysis.id ? null : analysis.id
                        )
                      }
                    >
                      {expandedId === analysis.id ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>

                {/* Expanded details */}
                {expandedId === analysis.id && analysis.status === "completed" && (
                  <div className="mt-4 space-y-4 border-t pt-4">
                    {/* Strengths */}
                    {analysis.strengths.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="font-medium text-sm">Strengths</span>
                        </div>
                        <ul className="space-y-1">
                          {analysis.strengths.map((s, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex gap-2">
                              <span className="text-green-500 shrink-0">•</span>
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Weaknesses */}
                    {analysis.weaknesses.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <XCircle className="h-4 w-4 text-red-500" />
                          <span className="font-medium text-sm">Weaknesses</span>
                        </div>
                        <ul className="space-y-1">
                          {analysis.weaknesses.map((w, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex gap-2">
                              <span className="text-red-500 shrink-0">•</span>
                              {w}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Missing keywords */}
                    {analysis.missing_keywords.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle className="h-4 w-4 text-yellow-500" />
                          <span className="font-medium text-sm">Missing keywords</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {analysis.missing_keywords.map((k, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {k}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recommendations */}
                    {analysis.recommendations.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="h-4 w-4 text-blue-500" />
                          <span className="font-medium text-sm">Recommendations</span>
                        </div>
                        <ul className="space-y-1">
                          {analysis.recommendations.map((r, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex gap-2">
                              <span className="text-blue-500 shrink-0">•</span>
                              {r}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}