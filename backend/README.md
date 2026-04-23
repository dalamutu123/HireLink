# Job Board Platform

We're building this platform to take the headache out of hiring. Right now, finding a job (or the right person for one) feels way more complicated than it needs to be. Our goal is to fix that with a clean, straightforward space where talent and companies can actually find each other without the usual noise.

### What we're working on:
* **Easy Discovery:** A search experience that actually surfaces relevant roles.
* **No-Fuss Management:** A simple way to keep track of applications so nobody gets left in the dark.
* **Built for Speed:** Using a modern tech stack to keep things snappy and reliable.

---

### The Vision
Whether you're a brand looking for your next lead or a developer looking for your next challenge, we want this to be the place you start.

# API Documentation (WIP)

This is the initial endpoint structure for the job board platform. All endpoints are grouped by their respective modules.

---

## 1. Auth (`/auth`)
**User Model:** `id`, `email`, `password (hashed)`, `role (job_seeker / employer)`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/signup` | Register a new Employee or Employer account. |
| `POST` | `/login` | Authenticate and receive a session/token. |
| `GET` | `/get_user` | Retrieve the current authenticated user's data. |

---

## 2. Profiles (`/profiles`)
**Employer:** `company_name`, `description`  
**Job Seeker:** `resume_url/text`, `skills`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/me` | Get the current user's profile details. |
| `PATCH` | `/update` | Update profile information (name, location, bio, etc.). |

---

## 3. Jobs (`/jobs`)
**Job Model:** `title`, `description`, `salary (optional)`, `location`, `employer_id`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/` | Create a new job listing (**Employers only**). |
| `GET` | `/` | List all jobs (Paginated). Separate logic for Employer/Employee view. |
| `GET` | `/{id}` | Get specific job details. |
| `PATCH` | `/{id}` | Edit an existing job listing (**Employers only**). |
| `DELETE` | `/{id}` | Remove a job listing (**Employers only**). |
| `GET` | `/search` | Search/Filter by `title`, `location`, `salary_range`. |

---

## 4. Applications (`/applications`)
**Application Model:** `id`, `job_id`, `user_id`, `status (applied / accepted / rejected)`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/apply/{job_id}` | Submit an application for a specific job. |
| `GET` | `/` | Get a list of all applications submitted by the user. |
| `GET` | `/job/{job_id}` | View all candidates for a specific job (**Employer view**). |
| `PATCH` | `/{id}/status` | Update status to `accepted` or `rejected` (**Employer only**). |

---

## 5. Notifications (`/notifications`)
* **To Employees:** Triggers on status changes (Accept/Reject).
* **To Employers:** Triggers on every new application.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/all` | Get all active notifications (expires after 24 hours). |