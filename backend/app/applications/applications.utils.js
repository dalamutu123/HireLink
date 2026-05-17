// Map DB row to API application model: id, job_id, user_id, status
export const formatApplication = (row) => {
  if (!row) return null;
  const { jobseeker_id, ...rest } = row;
  return { ...rest, user_id: jobseeker_id };
};

export const formatApplications = (rows) => rows.map(formatApplication);
