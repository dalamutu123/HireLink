# HireLink Backend

REST API for the HireLink job board platform — authentication, profiles, job listings, search & filtering, applications, and pagination.

**Base URL:** `http://localhost:5000` (default)

---

## Capabilities Overview

| Feature | Endpoints | Details |
| :--- | :--- | :--- |
| **Authentication** | `/api/auth/*` | Register, login, logout, forgot/reset password · JWT (7-day expiry) |
| **User profiles** | `/api/users/*` | Jobseeker & employer profiles, password change, admin user list |
| **Job CRUD** | `/api/jobs` | Create, read, update, delete listings (employer) |
| **Job search** | `GET /api/jobs/search` | Title, location, salary range, **date posted** |
| **Job filtering** | `GET /api/jobs` | All search filters + industry & job type |
| **Salary range** | POST/PUT + filters | `salary_min` / `salary_max` on listings · `min_salary` / `max_salary` when querying |
| **Date posted** | Search & filter | `posted_on`, `posted_after`, `posted_before` (`created_at`) |
| **Applications** | `/api/apply`, `/api/applications` | Apply, list, withdraw, employer review, accept/reject |
| **Pagination** | All list endpoints | `page` (default `1`) · `limit` (default `10`, max `100`) |

**Roles:** `jobseeker` · `employer` · `admin`

---

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| Runtime | Node.js (ES modules) |
| Framework | Express 5 |
| Database | PostgreSQL (`pg`) |
| Auth | JWT + bcrypt |
| Validation | express-validator |
| Email | Nodemailer (Gmail) |

---

## Project Structure

```
backend/
├── app.js
├── package.json
└── app/
    ├── auth/
    ├── users/
    ├── jobs/                           # CRUD, search, filter
    ├── applications/
    │   ├── apply.routes.js             # POST /api/apply/:job_id
    │   ├── applications.routes.js
    │   ├── applications.controller.js
    │   ├── applications.model.js
    │   └── applications.utils.js       # jobseeker_id → user_id in API
    └── core/
        ├── db.js
        ├── middleware.js               # protect, restrictTo
        ├── validators.js
        ├── pagination.js
        ├── errorHandler.js
        ├── email.js
        ├── init.sql
        └── migrations/
            ├── 001_applied_status.sql
            └── 002_salary_range.sql
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL

### Install & run

```bash
cd backend
npm install
npm run dev          # development
# npm start          # production
```

### Database

**New database:**

```bash
psql -d your_database_name -f app/core/init.sql
```

**Upgrade existing database:**

```bash
psql -d your_database_name -f app/core/migrations/001_applied_status.sql
psql -d your_database_name -f app/core/migrations/002_salary_range.sql
```

### Environment variables

Create `backend/.env`:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/hirelink
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:3000
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
```

| Variable | Description |
| :--- | :--- |
| `PORT` | Server port (default `5000`) |
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | JWT signing secret |
| `CLIENT_URL` | Frontend URL (password reset links) |
| `EMAIL_USER` / `EMAIL_PASS` | Gmail credentials for reset emails |
| `NODE_ENV` | Set `development` to include error stacks |

**Health check:** `GET /` → `API running`

---

## Authentication

Include on protected routes:

```http
Authorization: Bearer <token>
```

Tokens are returned from `POST /api/auth/register` and `POST /api/auth/login`. Valid for **7 days**.

---

## Pagination

Optional on every list endpoint:

| Param | Default | Max |
| :--- | :--- | :--- |
| `page` | `1` | — |
| `limit` | `10` | `100` |

| Endpoint | Access |
| :--- | :--- |
| `GET /api/jobs` | Authenticated |
| `GET /api/jobs/search` | Authenticated |
| `GET /api/applications` | Jobseeker |
| `GET /api/applications/job/:job_id` | Employer (job owner) |
| `GET /api/users` | Admin |

```json
{
  "message": "...",
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 42,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  },
  "jobs": []
}
```

Empty pages return `200` with `"total": 0` and an empty array.

---

## API Route Map

| Prefix | Auth | Purpose |
| :--- | :--- | :--- |
| `/api/auth` | Public | Register, login, password reset |
| `/api/users` | JWT | Profiles, admin |
| `/api/jobs` | JWT | Jobs, search, filter |
| `/api/apply` | JWT | Submit application |
| `/api/applications` | JWT | Manage applications |

---

## API Reference

### Auth — `/api/auth`

| Method | Endpoint | Body | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/register` | `name`, `email`, `password`, `role` | Register → JWT + user |
| `POST` | `/login` | `email`, `password` | Login → JWT + user |
| `POST` | `/logout` | — | Logout acknowledgment |
| `POST` | `/forgot-password` | `email` | Send reset link (15 min) |
| `POST` | `/reset-password` | `token`, `newPassword` | Reset password |

```json
// POST /api/auth/register
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "securepass123",
  "role": "jobseeker"
}
```

---

### Users — `/api/users`

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/me` | JWT | Current user + profile |
| `PUT` | `/me` | JWT | Update account & profile |
| `PUT` | `/me/password` | JWT | `currentPassword`, `newPassword` |
| `DELETE` | `/me` | JWT | Delete own account |
| `GET` | `/` | Admin | List users (paginated) |
| `DELETE` | `/:id` | Admin | Delete user |
| `GET` | `/:id` | JWT | Public jobseeker/employer profile |

**Jobseeker profile fields:** `bio`, `skills`, `experience`, `resume_url`, `location`

**Employer profile fields:** `company_name`, `company_description`, `industry`, `website`, `location`

---

### Jobs — `/api/jobs`

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/search` | JWT | Search (requires ≥1 filter param) |
| `GET` | `/` | JWT | List all or filter |
| `GET` | `/:id` | JWT | Single job |
| `POST` | `/` | Employer | Create listing |
| `PUT` | `/:id` | Employer (owner) | Update listing |
| `DELETE` | `/:id` | Employer (owner) | Delete listing |

#### Create job — required fields

| Field | Required | Values / notes |
| :--- | :--- | :--- |
| `title` | Yes | |
| `description` | Yes | |
| `location` | Yes | |
| `industry` | Yes | |
| `job_type` | Yes | `full-time`, `part-time`, `contract` |
| `salary_min` | No | Integer — enables salary filtering |
| `salary_max` | No | Integer |
| `salary` | No | Display string |
| `deadline` | No | ISO date |

---

#### Search — `GET /api/jobs/search`

Requires **at least one** of: `title`, `location`, `min_salary`, `max_salary`, `posted_after`, `posted_before`, `posted_on`.

```http
GET /api/jobs/search?title=engineer&location=toronto&min_salary=50000&max_salary=100000&posted_after=2026-05-01&page=1&limit=10
Authorization: Bearer <token>
```

| Param | Description |
| :--- | :--- |
| `title` | Partial match on title (case-insensitive) |
| `location` | Partial match on location |
| `min_salary` | Job range reaches at least this amount |
| `max_salary` | Job starting salary is at most this amount |
| `posted_on` | Posted on exact date (`YYYY-MM-DD`) |
| `posted_after` | Posted on or after date |
| `posted_before` | Posted on or before date |
| `page`, `limit` | Pagination |

**Date posted** uses `jobs.created_at`. For a single day use `posted_on`; for a range use `posted_after` + `posted_before`.

```http
# Jobs posted in May 2026
GET /api/jobs/search?posted_after=2026-05-01&posted_before=2026-05-31

# Jobs posted today
GET /api/jobs/search?posted_on=2026-05-23
```

**Response:**

```json
{
  "message": "Job search completed successfully",
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 2,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPrevPage": false
  },
  "jobs": [
    {
      "id": 1,
      "title": "Software Engineer",
      "location": "Toronto, ON",
      "salary_min": 70000,
      "salary_max": 95000,
      "created_at": "2026-05-16T10:00:00.000Z",
      "employer_name": "Acme Corp"
    }
  ]
}
```

---

#### Filter — `GET /api/jobs`

Supports **all search params** plus:

| Param | Description |
| :--- | :--- |
| `keyword` | Alias for `title` |
| `industry` | Partial match |
| `job_type` | `full-time`, `part-time`, `contract` |

Omit all filters to return every job (paginated).

```http
GET /api/jobs?industry=technology&job_type=full-time&posted_after=2026-05-01&page=1
Authorization: Bearer <token>
```

#### Salary range logic

- **Listings:** set `salary_min` and `salary_max` when creating/updating a job.
- **Filtering:** job matches if its `[salary_min, salary_max]` overlaps the requested range.
- Jobs without `salary_min` are **excluded** when `min_salary` or `max_salary` is used.

---

### Apply — `/api/apply`

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/:job_id` | Jobseeker | Submit application |

Alias: `POST /api/applications/:jobId`

```http
POST /api/apply/5
Authorization: Bearer <token>
Content-Type: application/json

{ "cover_letter": "I am interested in this role." }
```

```json
{
  "message": "Application submitted successfully",
  "application": {
    "id": 1,
    "job_id": 5,
    "user_id": 12,
    "status": "applied",
    "applied_at": "2026-05-16T10:00:00.000Z"
  }
}
```

Duplicate applications → `409`.

---

### Applications — `/api/applications`

#### Model (API response)

| Field | Description |
| :--- | :--- |
| `id` | Application ID |
| `job_id` | Job listing ID |
| `user_id` | Applicant (`jobseeker_id` in DB) |
| `status` | `applied` · `accepted` · `rejected` |
| `cover_letter` | Optional |
| `applied_at` | Submission timestamp |

#### Workflow

```
Jobseeker                         Employer                          Jobseeker
POST /api/apply/:job_id      →    GET /applications/job/:id    →    GET /api/applications
(status: applied)                 PATCH /:id/status                  (sees accepted/rejected)
                                  { "status": "accepted" }
```

#### Endpoints

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Jobseeker | My applications (paginated) |
| `GET` | `/me` | Jobseeker | Alias for `GET /` |
| `DELETE` | `/:id` | Jobseeker (owner) | Withdraw (only while `applied`) |
| `GET` | `/job/:job_id` | Employer (owner) | Applicants + profiles (paginated) |
| `PATCH` | `/:id/status` | Employer (owner) | Accept or reject |

#### List my applications

```http
GET /api/applications?page=1&limit=10
Authorization: Bearer <token>
```

```json
{
  "message": "Applications retrieved successfully",
  "pagination": { "page": 1, "limit": 10, "total": 1, "totalPages": 1, "hasNextPage": false, "hasPrevPage": false },
  "applications": [
    {
      "id": 1,
      "job_id": 5,
      "user_id": 12,
      "status": "accepted",
      "job_title": "Software Engineer",
      "employer_name": "Acme Corp"
    }
  ]
}
```

#### View applicants (employer)

```http
GET /api/applications/job/5?page=1
Authorization: Bearer <token>
```

Includes: `jobseeker_name`, `jobseeker_email`, `bio`, `skills`, `experience`, `resume_url`, `location`.

#### Accept / reject

```http
PATCH /api/applications/1/status
Authorization: Bearer <token>
Content-Type: application/json

{ "status": "accepted" }
```

| Rule | Detail |
| :--- | :--- |
| Values | `accepted` or `rejected` only |
| Current status | Must be `applied` |
| Auth | Employer must own the job |

---

## Database Schema

| Table | Key columns |
| :--- | :--- |
| `users` | `name`, `email`, `password`, `role` |
| `jobseeker_profiles` | `bio`, `skills`, `experience`, `resume_url`, `location` |
| `employer_profiles` | `company_name`, `company_description`, `industry`, `website`, `location` |
| `jobs` | `title`, `description`, `location`, `industry`, `job_type`, `salary_min`, `salary_max`, `created_at` |
| `applications` | `job_id`, `jobseeker_id`, `status`, `cover_letter`, `applied_at` |
| `password_reset_tokens` | `token`, `expires_at` (15 min) |

- Application statuses: `applied` (default) → `accepted` / `rejected`
- `UNIQUE(job_id, jobseeker_id)` on applications
- Empty profile row created on register for `jobseeker` and `employer`

---

## Error Handling

| Condition | HTTP |
| :--- | :--- |
| Route not found | 404 |
| Validation failed | 400 + `errors[]` |
| Unauthorized / bad JWT | 401 |
| Forbidden (wrong role/owner) | 403 |
| Not found | 404 |
| Duplicate record | 409 |
| Server error | 500 |

```json
{
  "message": "Validation failed",
  "errors": [{ "field": "posted_after", "message": "posted_after must be a valid date (YYYY-MM-DD)" }]
}
```

---

## Scripts

| Command | Description |
| :--- | :--- |
| `npm start` | Run `node app.js` |
| `npm run dev` | Run with nodemon |

---

## Not Yet Implemented

- Email notifications on application status changes
- In-app notification system
- Resume file upload (`resume_url` text only)
- Admin dashboard beyond user management
