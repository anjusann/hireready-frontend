"use client";

import { useState } from "react";
import api from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Users, Loader2, ChevronDown, ChevronUp } from "lucide-react";

const DIFFICULTIES = ["easy", "medium", "hard"];

interface Question {
  question: string;
  category: string;
  suggested_answer: string;
  tips: string;
}

export default function InterviewPrepPage() {
  const [jobRole, setJobRole] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [count, setCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleGenerate = async () => {
    if (!jobRole.trim()) {
      toast.error("Please enter a job role.");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/interview-questions", {
        job_role: jobRole,
        difficulty,
        count,
      });
      setQuestions(res.data.data.questions || []);
      toast.success("Questions generated!");
    } catch {
      toast.error("Failed to generate questions.");
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    if (category === "technical") return "bg-blue-100 text-blue-800";
    if (category === "behavioral") return "bg-purple-100 text-purple-800";
    return "bg-orange-100 text-orange-800";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Interview prep</h1>
        <p className="text-muted-foreground mt-1">
          Generate interview questions and answers for any role.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Generate questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Job role</Label>
            <Input
              placeholder="e.g. Senior Laravel Developer, Business Analyst..."
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Difficulty</Label>
            <div className="flex gap-2">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                    difficulty === d
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Number of questions</Label>
            <div className="flex gap-2">
              {[5, 10, 15].map((n) => (
                <button
                  key={n}
                  onClick={() => setCount(n)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    count === n
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <Button onClick={handleGenerate} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Users className="h-4 w-4 mr-2" />
                Generate questions
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {questions.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">
            {questions.length} questions for {jobRole}
          </h2>
          {questions.map((q, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div
                  className="flex items-start justify-between gap-4 cursor-pointer"
                  onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-muted-foreground">
                        Q{i + 1}
                      </span>
                      <Badge className={`text-xs ${getCategoryColor(q.category)}`}>
                        {q.category}
                      </Badge>
                    </div>
                    <p className="font-medium text-sm">{q.question}</p>
                  </div>
                  {expandedIndex === i ? (
                    <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                  )}
                </div>

                {expandedIndex === i && (
                  <div className="mt-4 space-y-3 border-t pt-4">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">
                        Suggested answer
                      </p>
                      <p className="text-sm">{q.suggested_answer}</p>
                    </div>
                    {q.tips && (
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-xs font-medium text-blue-800 mb-1">
                          Tips
                        </p>
                        <p className="text-sm text-blue-700">{q.tips}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}