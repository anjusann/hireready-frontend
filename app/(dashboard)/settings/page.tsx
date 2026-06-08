"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useTheme } from "next-themes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  User,
  Shield,
  Bell,
  Palette,
  Sun,
  Moon,
  Monitor,
  Check,
  Lock,
} from "lucide-react";
import Link from "next/link";
import api from "@/lib/axios";

export default function SettingsPage() {
  const { user } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

    useEffect(() => {
    setMounted(true);
  }, []);

  // Notification states
  const [notifications, setNotifications] = useState({
    email_analyses:     true,
    email_applications: true,
    email_interviews:   false,
    push_all:           false,
  });

  // Password change state
  const [passwords, setPasswords] = useState({
    current_password:      "",
    password:              "",
    password_confirmation: "",
  });
  const [changingPassword, setChangingPassword] = useState(false);

  const handleNotificationToggle = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
    toast.success("Notification preference saved.");
  };

  const handlePasswordChange = async () => {
    if (!passwords.current_password || !passwords.password) {
      toast.error("Please fill in all password fields.");
      return;
    }
    if (passwords.password !== passwords.password_confirmation) {
      toast.error("New passwords do not match.");
      return;
    }
    if (passwords.password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    setChangingPassword(true);
    try {
      await api.put("/profile/password", passwords);
      toast.success("Password changed successfully!");
      setPasswords({ current_password: "", password: "", password_confirmation: "" });
    } catch {
      toast.error("Failed to change password. Check your current password.");
    } finally {
      setChangingPassword(false);
    }
  };

  const themes = [
    { value: "light",  label: "Light",  icon: Sun },
    { value: "dark",   label: "Dark",   icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account and preferences.
        </p>
      </div>

      {/* Profile */}
      <Link href="/profile">
        <Card className="cursor-pointer hover:border-primary transition-colors">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Profile</p>
              <p className="text-sm text-muted-foreground">
                {user?.name} • {user?.email}
              </p>
            </div>
            <span className="text-sm text-muted-foreground">Edit →</span>
          </CardContent>
        </Card>
      </Link>

      {/* Subscription */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-4 w-4 text-green-600" />
            Subscription
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted/40 rounded-lg">
            <div>
              <p className="font-medium capitalize">
                {user?.subscription_plan || "free"} Plan
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {user?.subscription_plan === "free"
                  ? "3 ATS analyses/day • 5 resumes max"
                  : "Unlimited analyses • 20 resumes"}
              </p>
            </div>
            <Badge className={user?.subscription_plan === "pro"
              ? "bg-purple-100 text-purple-800"
              : "bg-blue-100 text-blue-800"
            }>
              {user?.subscription_plan === "pro" ? "Pro" : "Free"}
            </Badge>
          </div>

          {user?.subscription_plan === "free" && (
            <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
              <p className="font-medium text-indigo-800">Upgrade to Pro</p>
              <p className="text-sm text-indigo-600 mt-1">
                Get unlimited ATS analyses, 20 resumes, and priority support.
              </p>
              <Button
  className="mt-3 bg-indigo-600 hover:bg-indigo-700 text-white"
  size="sm"
  onClick={() => toast.info("Payment integration coming soon! Contact support to upgrade manually.")}
>
  Upgrade now — $20/month
</Button>
            </div>
          )}

          <div className="space-y-2">
            <p className="text-sm font-medium">Plan features</p>
            {[
              { label: "Resume uploads",     free: "5 max",     pro: "20 max" },
              { label: "ATS analyses",       free: "3/day",     pro: "Unlimited" },
              { label: "Cover letters",      free: "Unlimited", pro: "Unlimited" },
              { label: "Job match",          free: "Unlimited", pro: "Unlimited" },
              { label: "Interview prep",     free: "Unlimited", pro: "Unlimited" },
              { label: "Priority support",   free: "❌",        pro: "✅" },
            ].map((feature) => (
              <div key={feature.label} className="flex items-center justify-between text-sm py-1">
                <span className="text-muted-foreground">{feature.label}</span>
                <span className="font-medium">
                  {user?.subscription_plan === "pro" ? feature.pro : feature.free}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Palette className="h-4 w-4 text-orange-500" />
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            Choose your preferred theme.
          </p>
          <div className="flex gap-3">
            {themes.map((t) => {
          const Icon = t.icon;
            const isActive = mounted && theme === t.value;
              return (
                <button
                  key={t.value}
                  onClick={() => {
                    setTheme(t.value);
                    toast.success(`${t.label} theme applied.`);
                  }}
                  className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors ${
                    isActive
                      ? "border-primary bg-primary/5"
                      : "border-muted hover:border-muted-foreground"
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                  <span className={`text-sm font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                    {t.label}
                  </span>
                  {isActive && <Check className="h-3 w-3 text-primary" />}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Bell className="h-4 w-4 text-purple-500" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: "email_analyses",     label: "ATS analysis complete",    desc: "Get notified when your analysis is ready" },
            { key: "email_applications", label: "Application reminders",    desc: "Follow-up reminders for your applications" },
            { key: "email_interviews",   label: "Interview reminders",      desc: "Reminders for scheduled interviews" },
            { key: "push_all",           label: "Push notifications",       desc: "Enable browser push notifications" },
          ].map((item, index, arr) => (
            <div key={item.key}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <button
                  onClick={() => handleNotificationToggle(item.key as keyof typeof notifications)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications[item.key as keyof typeof notifications]
                      ? "bg-primary"
                      : "bg-muted-foreground/30"
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications[item.key as keyof typeof notifications]
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`} />
                </button>
              </div>
              {index < arr.length - 1 && <Separator className="mt-4" />}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Lock className="h-4 w-4 text-red-500" />
            Change password
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <input
            type="password"
            placeholder="Current password"
            value={passwords.current_password}
            onChange={(e) => setPasswords({ ...passwords, current_password: e.target.value })}
            className="w-full p-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background"
          />
          <input
            type="password"
            placeholder="New password (min 8 characters)"
            value={passwords.password}
            onChange={(e) => setPasswords({ ...passwords, password: e.target.value })}
            className="w-full p-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background"
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={passwords.password_confirmation}
            onChange={(e) => setPasswords({ ...passwords, password_confirmation: e.target.value })}
            className="w-full p-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background"
          />
          <Button
            onClick={handlePasswordChange}
            disabled={changingPassword}
            variant="outline"
          >
            {changingPassword ? "Changing..." : "Change password"}
          </Button>
        </CardContent>
      </Card>

      {/* Account info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Account info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { label: "Name",         value: user?.name },
            { label: "Email",        value: user?.email },
            { label: "Plan",         value: user?.subscription_plan },
            { label: "Member since", value: user?.created_at ? new Date(user.created_at).toLocaleDateString() : "-" },
          ].map((item) => (
            <div key={item.label} className="flex justify-between text-sm">
              <span className="text-muted-foreground">{item.label}</span>
              <span className="font-medium capitalize">{item.value}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}