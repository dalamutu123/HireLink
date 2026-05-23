import { apiFetch, API_URL } from "./api";

// ==========================================
// TypeScript Types & Interfaces
// ==========================================

export interface User {
  id: number;
  name: string;
  email: string;
  role: "jobseeker" | "employer" | "admin";
  created_at: string;
}

export interface JobseekerProfile extends User {
  bio: string | null;
  skills: string | null;
  experience: string | null;
  resume_url: string | null;
  location: string | null;
}

export interface EmployerProfile extends User {
  company_name: string | null;
  company_description: string | null;
  industry: string | null;
  website: string | null;
  location: string | null;
}

export interface Job {
  id: number;
  employer_id: number;
  employer_name?: string;
  title: string;
  description: string;
  location: string;
  industry: string;
  salary: string | null;
  salary_min: number | null;
  salary_max: number | null;
  job_type: "full-time" | "part-time" | "contract";
  deadline: string | null;
  created_at: string;
  updated_at: string;
}

export interface Application {
  id: number;
  job_id: number;
  user_id: number; // mapped from db 'jobseeker_id' in formatApplication
  status: "applied" | "accepted" | "rejected";
  cover_letter: string | null;
  applied_at: string;
  job_title?: string;
  location?: string;
  job_type?: string;
  industry?: string;
  salary?: string;
  employer_name?: string;
  jobseeker_name?: string;
  jobseeker_email?: string;
  bio?: string | null;
  skills?: string | null;
  experience?: string | null;
  resume_url?: string | null;
}

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface PaginatedResponse<T> {
  message: string;
  pagination: PaginationInfo;
  users?: T[];
  jobs?: T[];
  applications?: T[];
}

const BASE_URL = API_URL.replace(/\/api$/, "") || "http://localhost:5001";

// ==========================================
// API Service Layer implementation
// ==========================================

export const apiService = {
  /**
   * Health Check Services (Database-free)
   */
  health: {
    check: async (timeoutMs: number = 5000): Promise<boolean> => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
      try {
        const res = await fetch(BASE_URL, { 
          method: "GET", 
          signal: controller.signal 
        });
        clearTimeout(timeoutId);
        return res.ok;
      } catch (error) {
        clearTimeout(timeoutId);
        return false;
      }
    },
  },

  /**
   * Authentication Services
   */
  auth: {
    register: async (body: Record<string, any>): Promise<{ message: string; token: string; user: User }> => {
      return apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify(body),
      });
    },

    login: async (body: Record<string, any>): Promise<{ message: string; token: string; user: User }> => {
      return apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify(body),
      });
    },

    logout: async (): Promise<{ message: string }> => {
      return apiFetch("/auth/logout", {
        method: "POST",
      });
    },

    forgotPassword: async (email: string): Promise<{ message: string }> => {
      return apiFetch("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
    },

    resetPassword: async (body: Record<string, any>): Promise<{ message: string }> => {
      return apiFetch("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify(body),
      });
    },
  },

  /**
   * User & Profile Services
   */
  users: {
    getMe: async (): Promise<{ user: JobseekerProfile | EmployerProfile | User }> => {
      return apiFetch("/users/me", {
        method: "GET",
      });
    },

    updateMe: async (body: Record<string, any>): Promise<{ message: string; profile: any }> => {
      return apiFetch("/users/me", {
        method: "PUT",
        body: JSON.stringify(body),
      });
    },

    changePassword: async (body: Record<string, any>): Promise<{ message: string }> => {
      return apiFetch("/users/me/password", {
        method: "PUT",
        body: JSON.stringify(body),
      });
    },

    deleteMe: async (): Promise<{ message: string }> => {
      return apiFetch("/users/me", {
        method: "DELETE",
      });
    },

    getUsers: async (params?: Record<string, any>): Promise<PaginatedResponse<User>> => {
      const query = params ? `?${new URLSearchParams(params).toString()}` : "";
      return apiFetch(`/users${query}`, {
        method: "GET",
      });
    },

    deleteUser: async (id: number): Promise<{ message: string }> => {
      return apiFetch(`/users/${id}`, {
        method: "DELETE",
      });
    },

    getUserById: async (id: number): Promise<{ user: JobseekerProfile | EmployerProfile }> => {
      return apiFetch(`/users/${id}`, {
        method: "GET",
      });
    },
  },

  /**
   * Job Posting & Search Services
   */
  jobs: {
    getJobs: async (params?: Record<string, any>): Promise<PaginatedResponse<Job>> => {
      const query = params ? `?${new URLSearchParams(params).toString()}` : "";
      return apiFetch(`/jobs${query}`, {
        method: "GET",
      });
    },

    searchJobs: async (params: Record<string, any>): Promise<PaginatedResponse<Job>> => {
      const query = `?${new URLSearchParams(params).toString()}`;
      return apiFetch(`/jobs/search${query}`, {
        method: "GET",
      });
    },

    getJob: async (id: number): Promise<{ job: Job }> => {
      return apiFetch(`/jobs/${id}`, {
        method: "GET",
      });
    },

    postJob: async (body: Record<string, any>): Promise<{ message: string; job: Job }> => {
      return apiFetch("/jobs", {
        method: "POST",
        body: JSON.stringify(body),
      });
    },

    updateJob: async (id: number, body: Record<string, any>): Promise<{ message: string; job: Job }> => {
      return apiFetch(`/jobs/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
      });
    },

    deleteJob: async (id: number): Promise<{ message: string }> => {
      return apiFetch(`/jobs/${id}`, {
        method: "DELETE",
      });
    },
  },

  /**
   * Application Processing Services
   */
  applications: {
    apply: async (jobId: number, coverLetter?: string): Promise<{ message: string; application: Application }> => {
      return apiFetch(`/apply/${jobId}`, {
        method: "POST",
        body: JSON.stringify({ cover_letter: coverLetter }),
      });
    },

    getMyApplications: async (params?: Record<string, any>): Promise<PaginatedResponse<Application>> => {
      const query = params ? `?${new URLSearchParams(params).toString()}` : "";
      return apiFetch(`/applications${query}`, {
        method: "GET",
      });
    },

    withdraw: async (id: number): Promise<{ message: string }> => {
      return apiFetch(`/applications/${id}`, {
        method: "DELETE",
      });
    },

    getJobApplications: async (jobId: number, params?: Record<string, any>): Promise<PaginatedResponse<Application>> => {
      const query = params ? `?${new URLSearchParams(params).toString()}` : "";
      return apiFetch(`/applications/job/${jobId}${query}`, {
        method: "GET",
      });
    },

    updateStatus: async (id: number, status: "accepted" | "rejected"): Promise<{ message: string; application: Application }> => {
      return apiFetch(`/applications/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
    },
  },
};
