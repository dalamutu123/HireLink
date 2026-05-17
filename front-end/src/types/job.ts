export type JobType = 'full-time' | 'part-time' | 'contract';

export interface Job {
  id: number;
  employer_id: number;
  title: string;
  type: string;
  description: string;
  location: string;
  industry: string;
  salary?: string;
  job_type: JobType;
  deadline?: string;
  created_at: string;
  updated_at: string;
  employer_name?: string; // Joined from users table
}

export interface CreateJobInput {
  title: string;
  description: string;
  location: string;
  industry: string;
  salary?: string;
  job_type: JobType;
  deadline?: string;
}
