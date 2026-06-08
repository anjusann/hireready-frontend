"use client";

import { useAuthStore } from "@/store/authStore";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Target, Briefcase, Calendar, Loader2 } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useAuthStore();

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const res = await api.get("/dashboard/stats");
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const stats = [
    {
      title: "Total resumes",
      value: isLoading ? "..." : data?.total_resumes ?? 0,
      icon: FileText,
      color: "text-blue-500",
      bg: "bg-blue-100",
      href: "/resumes",
    },
    {
      title: "Average ATS score",
      value: isLoading ? "..." : `${data?.average_ats_score ?? 0}%`,
      icon: Target,
      color: "text-green-500",
      bg: "bg-green-100",
      href: "/ats-analysis",
    },
    {
      title: "Applications sent",
      value: isLoading ? "..." : data?.applications_sent ?? 0,
      icon: Briefcase,
      color: "text-purple-500",
      bg: "bg-purple-100",
      href: "/applications",
    },
    {
      title: "Interviews scheduled",
      value: isLoading ? "..." : data?.interviews_scheduled ?? 0,
      icon: Calendar,
      color: "text-orange-500",
      bg: "bg-orange-100",
      href: "/applications",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">
          Welcome back, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Here is what is happening with your job search today.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link href={stat.href} key={stat.title}>
              <Card className="hover:border-primary transition-colors cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`h-8 w-8 rounded-lg ${stat.bg} flex items-center justify-center`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  ) : (
                    <p className="text-2xl font-bold">{stat.value}</p>
                  )}
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Quick actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/resumes">
            <Card className="cursor-pointer hover:border-primary transition-colors">
              <CardContent className="flex items-center gap-4 pt-6">
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Upload resume</p>
                  <p className="text-sm text-muted-foreground">Add a new resume</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/ats-analysis">
            <Card className="cursor-pointer hover:border-primary transition-colors">
              <CardContent className="flex items-center gap-4 pt-6">
                <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <Target className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Analyze ATS</p>
                  <p className="text-sm text-muted-foreground">Check your score</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/applications">
            <Card className="cursor-pointer hover:border-primary transition-colors">
              <CardContent className="flex items-center gap-4 pt-6">
                <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Briefcase className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">Track application</p>
                  <p className="text-sm text-muted-foreground">Add a new application</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Recent analyses */}
      {data?.ats_trend?.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Recent ATS scores</h2>
          <div className="flex gap-3 flex-wrap">
            {data.ats_trend.map((item: { date: string; score: number }, i: number) => (
              <Card key={i} className="flex-shrink-0">
                <CardContent className="p-4 text-center">
                  <p className={`text-2xl font-bold ${
                    item.score >= 70 ? "text-green-600" :
                    item.score >= 50 ? "text-yellow-600" : "text-red-600"
                  }`}>
                    {item.score}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{item.date}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}