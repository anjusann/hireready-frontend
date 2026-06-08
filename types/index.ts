export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  location: string | null;
  linkedin_url: string | null;
  subscription_plan: "free" | "pro";
  email_verified_at: string | null;
  created_at: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
    token_type: string;
  };
}

export interface Resume {
  id: number;
  title: string;
  file_type: string;
  file_size: number;
  is_primary: boolean;
  created_at: string;
}

export interface ResumeAnalysis {
  id: number;
  resume_id: number;
  status: "pending" | "completed" | "failed";
  ats_score: number;
  strengths: string[];
  weaknesses: string[];
  missing_keywords: string[];
  recommendations: string[];
  analyzed_at: string | null;
  created_at: string;
  resume?: {
    id: number;
    title: string;
  };
}

export interface Application {
  id: number;
  company_name: string;
  job_title: string;
  status:
    | "applied"
    | "under_review"
    | "interview_scheduled"
    | "final_interview"
    | "offer_received"
    | "rejected"
    | "withdrawn";
  applied_date: string;
  notes: string | null;
  follow_up_date: string | null;
  created_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: Record<string, string[]> | null;
  meta: Record<string, unknown>;
}