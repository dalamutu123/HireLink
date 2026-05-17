export type UserRole = 'jobseeker' | 'employer' | 'admin';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface JobseekerProfile extends User {
  bio?: string;
  skills?: string;
  experience?: string;
  resume_url?: string;
  location?: string;
}

export interface EmployerProfile extends User {
  company_name?: string;
  company_description?: string;
  industry?: string;
  website?: string;
  location?: string;
}
