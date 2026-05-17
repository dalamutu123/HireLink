export type ApplicationStatus = 'pending' | 'accepted' | 'rejected';

export interface Application {
  id: number;
  job_id: number;
  jobseeker_id: number;
  status: ApplicationStatus;
  cover_letter?: string;
  applied_at: string;
  
  // Joined fields for convenience
  job_title?: string;
  employer_name?: string;
  job_location?: string;
  job_type?: string;
  
  // For employer view
  jobseeker_name?: string;
  jobseeker_email?: string;
  jobseeker_bio?: string;
  jobseeker_skills?: string;
  jobseeker_experience?: string;
  jobseeker_resume_url?: string;
}

export interface CreateApplicationInput {
  cover_letter?: string;
}
