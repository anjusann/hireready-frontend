"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Target, FileText, Briefcase, MessageSquare,
  Users, Star, ArrowRight, Check, Zap, Menu, X,
  TrendingUp, Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link 
  href="/" 
  className="flex items-center gap-2"
  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
>
  <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center">
    <Zap className="h-5 w-5 text-white" />
  </div>
  <span className="font-bold text-xl text-gray-900">
    HireReady <span className="text-indigo-600">UAE</span>
  </span>
</Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-gray-600 hover:text-indigo-600 font-medium">Features</a>
            <a href="#how-it-works" className="text-sm text-gray-600 hover:text-indigo-600 font-medium">How it works</a>
            <a href="#pricing" className="text-sm text-gray-600 hover:text-indigo-600 font-medium">Pricing</a>
            <a href="#contact" className="text-sm text-gray-600 hover:text-indigo-600 font-medium">Contact</a>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                Get started free
              </Button>
            </Link>
          </div>

          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t bg-white px-6 py-4 space-y-3">
            <a href="#features" className="block text-sm py-2 text-gray-600" onClick={() => setMenuOpen(false)}>Features</a>
            <a href="#how-it-works" className="block text-sm py-2 text-gray-600" onClick={() => setMenuOpen(false)}>How it works</a>
            <a href="#pricing" className="block text-sm py-2 text-gray-600" onClick={() => setMenuOpen(false)}>Pricing</a>
            <a href="#contact" className="block text-sm py-2 text-gray-600" onClick={() => setMenuOpen(false)}>Contact</a>
            <div className="flex gap-2 pt-2">
              <Link href="/login" className="flex-1">
                <Button variant="outline" className="w-full" size="sm">Sign in</Button>
              </Link>
              <Link href="/register" className="flex-1">
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" size="sm">Get started</Button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-24 px-6 bg-gradient-to-b from-indigo-50 via-white to-white">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200 px-4 py-1.5 text-sm font-medium">
            Designed for the UAE Job Market
          </Badge>
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight text-gray-900">
            Get hired faster
            <br />
            <span className="text-indigo-600">with AI by your side</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            HireReady UAE helps you optimize your resume, generate tailored cover
            letters, match with jobs, and prepare for interviews — powered by
            Google Gemini AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto px-10 bg-indigo-600 hover:bg-indigo-700 text-white text-base h-12">
                Start for free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto px-10 text-base h-12 border-gray-300">
                Sign in to dashboard
              </Button>
            </Link>
          </div>
          <p className="text-sm text-gray-400">
            No credit card required — Free plan available — Setup in 2 minutes
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-indigo-600">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-4xl font-extrabold text-white">95%</p>
            <p className="text-sm text-indigo-200 mt-1">ATS pass rate</p>
          </div>
          <div>
            <p className="text-4xl font-extrabold text-white">3x</p>
            <p className="text-sm text-indigo-200 mt-1">More interviews</p>
          </div>
          <div>
            <p className="text-4xl font-extrabold text-white">10,000+</p>
            <p className="text-sm text-indigo-200 mt-1">Resumes analyzed</p>
          </div>
          <div>
            <p className="text-4xl font-extrabold text-white">UAE</p>
            <p className="text-sm text-indigo-200 mt-1">Market focused</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-indigo-50 text-indigo-600 mb-4">Features</Badge>
            <h2 className="text-4xl font-bold text-gray-900">
              Everything you need to get hired
            </h2>
            <p className="text-gray-500 mt-4 max-w-xl mx-auto">
              Powered by Google Gemini AI — trusted by top career coaches across the UAE.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            <div className="p-6 rounded-2xl border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all group">
              <div className="h-12 w-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center mb-4">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">ATS Resume Analyzer</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Get an ATS score, identify missing keywords, and receive specific recommendations to pass automated screening systems used by UAE employers.</p>
            </div>

            <div className="p-6 rounded-2xl border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all group">
              <div className="h-12 w-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                <Briefcase className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Job Match Scoring</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Paste any job description and instantly see how well your resume matches. Know exactly which skills to highlight or develop.</p>
            </div>

            <div className="p-6 rounded-2xl border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all group">
              <div className="h-12 w-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Cover Letter Generator</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Generate a personalized cover letter for any job in seconds. Choose professional, creative, or concise tone.</p>
            </div>

            <div className="p-6 rounded-2xl border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all group">
              <div className="h-12 w-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-4">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Interview Preparation</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Get role-specific questions with suggested answers and coaching tips for technical and behavioral interviews.</p>
            </div>

            <div className="p-6 rounded-2xl border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all group">
              <div className="h-12 w-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mb-4">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Resume Management</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Upload and manage up to 5 resumes. Keep different versions for different roles and mark your primary resume.</p>
            </div>

            <div className="p-6 rounded-2xl border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all group">
              <div className="h-12 w-12 rounded-xl bg-yellow-100 text-yellow-600 flex items-center justify-center mb-4">
                <Star className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Application Tracker</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Track all applications in a visual Kanban board. Move cards from Applied to Offer Received and never miss a follow-up.</p>
            </div>

          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-indigo-50 text-indigo-600 mb-4">How it works</Badge>
            <h2 className="text-4xl font-bold text-gray-900">Get job-ready in 4 steps</h2>
            <p className="text-gray-500 mt-4">From upload to interview — we guide you every step of the way.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

            <div className="text-center space-y-4">
              <div className="h-12 w-12 rounded-full bg-indigo-600 text-white flex items-center justify-center mx-auto">
                <FileText className="h-5 w-5" />
              </div>
              <div className="text-xs font-bold text-indigo-400">01</div>
              <h3 className="font-bold text-gray-900">Upload resume</h3>
              <p className="text-sm text-gray-500">Upload your PDF or DOCX resume to get started instantly.</p>
            </div>

            <div className="text-center space-y-4">
              <div className="h-12 w-12 rounded-full bg-indigo-600 text-white flex items-center justify-center mx-auto">
                <Target className="h-5 w-5" />
              </div>
              <div className="text-xs font-bold text-indigo-400">02</div>
              <h3 className="font-bold text-gray-900">Get your ATS score</h3>
              <p className="text-sm text-gray-500">AI analyzes your resume and gives you a detailed score out of 100.</p>
            </div>

            <div className="text-center space-y-4">
              <div className="h-12 w-12 rounded-full bg-indigo-600 text-white flex items-center justify-center mx-auto">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div className="text-xs font-bold text-indigo-400">03</div>
              <h3 className="font-bold text-gray-900">Improve your resume</h3>
              <p className="text-sm text-gray-500">Follow AI recommendations to boost your score and visibility.</p>
            </div>

            <div className="text-center space-y-4">
              <div className="h-12 w-12 rounded-full bg-indigo-600 text-white flex items-center justify-center mx-auto">
                <Shield className="h-5 w-5" />
              </div>
              <div className="text-xs font-bold text-indigo-400">04</div>
              <h3 className="font-bold text-gray-900">Apply with confidence</h3>
              <p className="text-sm text-gray-500">Generate cover letters, track applications, and ace interviews.</p>
            </div>

          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-indigo-50 text-indigo-600 mb-4">Pricing</Badge>
            <h2 className="text-4xl font-bold text-gray-900">Simple, transparent pricing</h2>
            <p className="text-gray-500 mt-4">Start free. Upgrade when you need more power.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">

            <Card className="border-2 border-gray-100">
              <CardContent className="pt-8 space-y-6">
                <div>
                  <p className="font-bold text-xl text-gray-900">Free</p>
                  <p className="text-4xl font-extrabold text-gray-900 mt-2">
                    $0 <span className="text-base font-normal text-gray-400">/month</span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Perfect to get started</p>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-sm text-gray-700">
                    <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    5 resume uploads
                  </li>
                  <li className="flex items-center gap-3 text-sm text-gray-700">
                    <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    3 ATS analyses per day
                  </li>
                  <li className="flex items-center gap-3 text-sm text-gray-700">
                    <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    Unlimited cover letters
                  </li>
                  <li className="flex items-center gap-3 text-sm text-gray-700">
                    <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    Unlimited job matching
                  </li>
                  <li className="flex items-center gap-3 text-sm text-gray-700">
                    <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    Application tracker
                  </li>
                </ul>
                <Link href="/register">
                  <Button variant="outline" className="w-full border-gray-300 h-11">
                    Get started free
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2 border-indigo-600 relative shadow-lg shadow-indigo-100">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Badge className="bg-indigo-600 text-white px-4 py-1">Most popular</Badge>
              </div>
              <CardContent className="pt-8 space-y-6">
                <div>
                  <p className="font-bold text-xl text-gray-900">Pro</p>
                  <p className="text-4xl font-extrabold text-gray-900 mt-2">
                    $20 <span className="text-base font-normal text-gray-400">/month</span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">For serious job seekers</p>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-sm text-gray-700">
                    <div className="h-5 w-5 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                      <Check className="h-3 w-3 text-indigo-600" />
                    </div>
                    20 resume uploads
                  </li>
                  <li className="flex items-center gap-3 text-sm text-gray-700">
                    <div className="h-5 w-5 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                      <Check className="h-3 w-3 text-indigo-600" />
                    </div>
                    Unlimited ATS analyses
                  </li>
                  <li className="flex items-center gap-3 text-sm text-gray-700">
                    <div className="h-5 w-5 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                      <Check className="h-3 w-3 text-indigo-600" />
                    </div>
                    Unlimited cover letters
                  </li>
                  <li className="flex items-center gap-3 text-sm text-gray-700">
                    <div className="h-5 w-5 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                      <Check className="h-3 w-3 text-indigo-600" />
                    </div>
                    Unlimited job matching
                  </li>
                  <li className="flex items-center gap-3 text-sm text-gray-700">
                    <div className="h-5 w-5 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                      <Check className="h-3 w-3 text-indigo-600" />
                    </div>
                    Application tracker
                  </li>
                  <li className="flex items-center gap-3 text-sm text-gray-700">
                    <div className="h-5 w-5 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                      <Check className="h-3 w-3 text-indigo-600" />
                    </div>
                    Priority support
                  </li>
                </ul>
                <Link href="/register">
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-11">
                    Get started — $20/mo
                  </Button>
                </Link>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24 px-6 bg-gray-50">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-10">
            <Badge className="bg-indigo-50 text-indigo-600 mb-4">Contact us</Badge>
            <h2 className="text-4xl font-bold text-gray-900">Get in touch</h2>
            <p className="text-gray-500 mt-4">
              Have questions? We are here to help UAE job seekers land their dream jobs.
            </p>
          </div>
          <div className="space-y-4 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <input
              type="text"
              placeholder="Your name"
              className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="email"
              placeholder="Your email"
              className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <textarea
              placeholder="Your message"
              rows={4}
              className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
            <Button size="lg" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-11">
              Send message
            </Button>
          </div>
          <p className="text-center text-sm text-gray-400 mt-6">
            Or email us at{" "}
            <a href="mailto:support@hirereadyuae.com" className="text-indigo-600 hover:underline">
              support@hirereadyuae.com
            </a>
          </p>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-6 bg-indigo-600">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-4xl font-extrabold text-white">
            Ready to get hired in the UAE?
          </h2>
          <p className="text-indigo-200 text-lg">
            Join thousands of job seekers using HireReady UAE to land their dream jobs.
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-white text-indigo-600 hover:bg-indigo-50 px-10 h-12 text-base font-semibold">
              Create free account
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-white text-lg">HireReady UAE</span>
              </div>
              <p className="text-sm max-w-xs">
                AI-powered career tools for UAE job seekers. Powered by Google Gemini.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-3">
                <p className="text-white font-medium text-sm">Product</p>
                <div className="space-y-2 text-sm">
                  <a href="#features" className="block hover:text-white transition-colors">Features</a>
                  <a href="#pricing" className="block hover:text-white transition-colors">Pricing</a>
                  <Link href="/login" className="block hover:text-white transition-colors">Login</Link>
                  <Link href="/register" className="block hover:text-white transition-colors">Register</Link>
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-white font-medium text-sm">Support</p>
                <div className="space-y-2 text-sm">
                  <a href="#contact" className="block hover:text-white transition-colors">Contact us</a>
                  <a href="mailto:support@hirereadyuae.com" className="block hover:text-white transition-colors">Email support</a>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm">2026 HireReady UAE. All rights reserved.</p>
            <p className="text-sm">Built with Laravel + Next.js + Google Gemini AI</p>
          </div>
        </div>
      </footer>

    </div>
  );
}