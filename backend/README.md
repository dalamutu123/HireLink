# HireLink Backend

REST API for the HireLink job board platform. Connects employers with job seekers through authentication, profiles, job listings, applications, search, and filtering.

---

## Capabilities Overview

| Feature | Endpoints | Notes |
| :--- | :--- | :--- |
| **Authentication** | `/api/auth/*` | Register, login, logout, forgot/reset password (JWT, 7-day expiry) |
| **User profiles** | `/api/users/*` | Jobseeker & employer profiles, password change, admin user management |
| **Job listings** | `/api/jobs/*` | CRUD (employer), list & view (authenticated) |
| **Job search** | `GET /api/jobs/search` | Search by title, location, salary range, date posted |
| **Job filtering** | `GET /api/jobs` | Filter by title, location, industry, job type, salary range, date posted |
| **Salary range** | POST/PUT jobs + search filters | `salary_min` / `salary_max` on listings; `min_salary` / `max_salary` when searching |
| **Applications** | `/api/apply`, `/api/applications/*` | Apply, list, withdraw, employer review, accept/reject |
| **Pagination** | All list endpoints | `page` & `limit` query params on jobs, applications, users |

**Roles:** `jobseeker`, `employer`, `admin`

---

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| Runtime | Node.js (ES modules) |
| Framework | Express 5 |
| Database | PostgreSQL (`pg`) |
| Auth | JWT (`jsonwebtoken`) + bcrypt |
| Validation | express-validator |
| Email | Nodemailer (Gmail) |

---

## Project Structure

```
backend/
├── app.js                              # Mounts all /api routes
├── package.json
└── app/
    ├── auth/                           # Register, login, password reset
    ├── users/                          # Profiles, admin user management
    ├── jobs/                           # CRUD, search, filter
    ├── applications/
    │   ├── apply.routes.js             # POST /api/apply/:job_id
    │   ├── applications.routes.js      # List, withdraw, employer view, PATCH status
    │   ├── applications.controller.js
    │   ├── applications.model.js
    │   └── applications.utils.js       # Maps jobseeker_id → user_id in responses
    └── core/
        ├── db.js
        ├── middleware.js               # JWT + role-based access (protect, restrictTo)
        ├── validators.js
        ├── pagination.js               # Shared page/limit parsing
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
- PostgreSQL database

### Installation

```bash
cd backend
npm install
```

### Database Setup

**New database:**

```bash
psql -d your_database_name -f app/core/init.sql
```

**Existing database** — run migrations as needed:

```bash
psql -d your_database_name -f app/core/migrations/001_applied_status.sql
psql -d your_database_name -f app/core/migrations/002_salary_range.sql
```

### Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/hirelink
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:3000
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
```

### Run the Server

```bash
npm start        # production
npm run dev      # development (nodemon)
```

Health check: `GET /` → `API running`

---

## Authentication

Protected routes require:

```
Authorization: Bearer <token>
```

Tokens are issued on register/login, valid for **7 days**.

---

## Pagination

All list endpoints accept optional query parameters:

| Param | Default | Max |
| :--- | :--- | :--- |
| `page` | `1` | — |
| `limit` | `10` | `100` |

**Paginated endpoints:**

| Endpoint | Who |
| :--- | :--- |
| `GET /api/jobs` | Authenticated |
| `GET /api/jobs/search` | Authenticated |
| `GET /api/applications` | Jobseeker |
| `GET /api/applications/job/:job_id` | Employer (job owner) |
| `GET /api/users` | Admin |

**Response shape** (all paginated lists):

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

Empty results return `200` with an empty array and `"total": 0`.

---

## API Route Map

| Prefix | Purpose |
| :--- | :--- |
| `/api/auth` | Authentication (public) |
| `/api/users` | Profiles & admin |
| `/api/jobs` | Job listings, search, filter |
| `/api/apply` | Submit application |
| `/api/applications` | Application management |

---

## API Reference

### Auth — `/api/auth` (public)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/register` | Register as `jobseeker`, `employer`, or `admin` → JWT + user |
| `POST` | `/login` | Login → JWT + user |
| `POST` | `/logout` | Logout acknowledgment |
| `POST` | `/forgot-password` | Send reset email |
| `POST` | `/reset-password` | Reset with `token` + `newPassword` |

---

### Users — `/api/users`

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/me` | Authenticated | Current user + profile |
| `PUT` | `/me` | Authenticated | Update profile |
| `PUT` | `/me/password` | Authenticated | Change password |
| `DELETE` | `/me` | Authenticated | Delete own account |
| `GET` | `/` | Admin | List all users (paginated) |
| `DELETE` | `/:id` | Admin | Delete user |
| `GET` | `/:id` | Authenticated | Public jobseeker/employer profile |

---

### Jobs — `/api/jobs`

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/search` | Authenticated | **Search** by title, location, salary (paginated) |
| `GET` | `/` | Authenticated | List all jobs or **filter** via query params (paginated) |
| `GET` | `/:id` | Authenticated | Single job details |
| `POST` | `/` | Employer | Create job listing |
| `PUT` | `/:id` | Employer (owner) | Update job listing |
| `DELETE` | `/:id` | Employer (owner) | Delete job listing |

#### Search jobs — `GET /api/jobs/search`

Dedicated search endpoint. Requires at least one of: `title`, `location`, `min_salary`, `max_salary`, `posted_after`, `posted_before`, `posted_on`.

```http
GET /api/jobs/search?title=engineer&location=toronto&posted_after=2026-05-01&page=1&limit=10
Authorization: Bearer <token>
```

| Param | Description |
| :--- | :--- |
| `title` | Partial match on job title (case-insensitive) |
| `location` | Partial match on location (case-insensitive) |
| `min_salary` | Jobs whose range reaches at least this amount |
| `max_salary` | Jobs whose starting salary is at most this amount |
| `posted_after` | Jobs posted on or after this date (`YYYY-MM-DD`) |
| `posted_before` | Jobs posted on or before this date (`YYYY-MM-DD`) |
| `posted_on` | Jobs posted on this exact date (`YYYY-MM-DD`) |
| `page`, `limit` | Pagination |

**Date posted** filters use the job's `created_at` timestamp. Use `posted_on` for a single day, or `posted_after` / `posted_before` for a range.

**Example response:**

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
      "employer_name": "Acme Corp"
    }
  ]
}
```

#### Filter jobs — `GET /api/jobs`

Same filters as search, plus additional fields. Omit all filter params to list every job.

```http
GET /api/jobs?title=developer&industry=technology&job_type=full-time&min_salary=60000&page=1
Authorization: Bearer <token>
```

| Param | Description |
| :--- | :--- |
| `title` | Partial match on title |
| `keyword` | Alias for `title` |
| `location` | Partial match on location |
| `industry` | Partial match on industry |
| `job_type` | Exact: `full-time`, `part-time`, `contract` |
| `min_salary` | Salary range filter (lower bound) |
| `max_salary` | Salary range filter (upper bound) |
| `posted_after` | Posted on or after date (`YYYY-MM-DD`) |
| `posted_before` | Posted on or before date (`YYYY-MM-DD`) |
| `posted_on` | Posted on exact date (`YYYY-MM-DD`) |
| `page`, `limit` | Pagination |

#### Salary range

**On job listings** (POST/PUT) — stored for filtering:

| Field | Type | Description |
| :--- | :--- | :--- |
| `salary_min` | integer | Lower bound (e.g. `60000`) |
| `salary_max` | integer | Upper bound (e.g. `90000`) |
| `salary` | string | Optional display text (e.g. `"$60k–$90k"`) |

**When searching/filtering** — overlap logic: a job matches if its `[salary_min, salary_max]` overlaps the requested range. Jobs without `salary_min` are excluded when a salary filter is used.

**Create job example:**

```json
{
  "title": "Software Engineer",
  "description": "...",
  "location": "Toronto",
  "industry": "Technology",
  "job_type": "full-time",
  "salary_min": 70000,
  "salary_max": 95000,
  "salary": "$70,000 - $95,000"
}
```

---

### Apply — `/api/apply`

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/:job_id` | Jobseeker | Apply for a job |

Alias: `POST /api/applications/:jobId`

```http
POST /api/apply/5
Authorization: Bearer <token>
Content-Type: application/json

{ "cover_letter": "I am interested in this role." }
```

**Response (`201`):**

```json
{
  "message": "Application submitted successfully",
  "application": {
    "id": 1,
    "job_id": 5,
    "user_id": 12,
    "status": "applied"
  }
}
```

---

### Applications — `/api/applications`

#### Application model (API response)

| Field | Description |
| :--- | :--- |
| `id` | Application ID |
| `job_id` | Job listing ID |
| `user_id` | Jobseeker who applied (`jobseeker_id` in DB) |
| `status` | `applied` → `accepted` or `rejected` |
| `cover_letter` | Optional |
| `applied_at` | Timestamp |

#### Workflow

```
Jobseeker                    Employer                         Jobseeker
─────────                    ────────                         ─────────
POST /api/apply/:job_id  →   GET /applications/job/:id   →   GET /api/applications
status: applied              PATCH /:id/status                 sees accepted/rejected
                             { "status": "accepted" }
```

#### Endpoints

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Jobseeker | List user's applications (paginated, includes status updates) |
| `GET` | `/me` | Jobseeker | Alias for `GET /` |
| `DELETE` | `/:id` | Jobseeker (owner) | Withdraw (only while `applied`) |
| `GET` | `/job/:job_id` | Employer (job owner) | View applicants + profiles (paginated) |
| `PATCH` | `/:id/status` | Employer (job owner) | Accept or reject |

#### List user's applications

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

Returns applicant profiles: `jobseeker_name`, `jobseeker_email`, `bio`, `skills`, `experience`, `resume_url`, `location`.

#### Accept or reject

```http
PATCH /api/applications/1/status
Authorization: Bearer <token>
Content-Type: application/json

{ "status": "accepted" }
```

| Rule | Detail |
| :--- | :--- |
| Allowed values | `accepted`, `rejected` only |
| Current status | Must be `applied` |
| Authorization | Employer must own the job |

Jobseeker sees the updated status on `GET /api/applications`.

---

## Database Schema

| Table | Purpose |
| :--- | :--- |
| `users` | Accounts: `name`, `email`, `password`, `role` |
| `jobseeker_profiles` | `bio`, `skills`, `experience`, `resume_url`, `location` |
| `employer_profiles` | `company_name`, `company_description`, `industry`, `website`, `location` |
| `jobs` | Listings with `salary_min`, `salary_max`, `job_type`, etc. |
| `applications` | `job_id`, `jobseeker_id`, `status`, `cover_letter` |
| `password_reset_tokens` | 15-minute expiry |

**Application statuses:** `applied` (default) · `accepted` · `rejected`

On registration, an empty profile is created automatically for `jobseeker` and `employer` roles.

---

## Error Handling

| Condition | Status |
| :--- | :--- |
| Route not found | 404 |
| Duplicate record (`23505`) | 409 |
| Foreign key violation (`23503`) | 400 |
| Invalid ID format (`22P02`) | 400 |
| Invalid/expired JWT | 401 |
| Validation failure | 400 (field-level `errors` array) |

---

## Scripts

| Command | Description |
| :--- | :--- |
| `npm start` | `node app.js` |
| `npm run dev` | Nodemon hot reload |

---

## Not Yet Implemented

- Email notifications on application status changes
- In-app notification system
- Resume file upload (only `resume_url` text field)
- Dedicated admin dashboard beyond user management
