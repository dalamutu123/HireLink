# HireLink Backend

REST API for the HireLink job board — auth, profiles, jobs (search/filter), applications, email & in-app notifications, and pagination.

**Base URL:** `http://localhost:5000`

---

## Quick Reference — All Endpoints

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Public | Health check |
| `POST` | `/api/auth/register` | Public | Register |
| `POST` | `/api/auth/login` | Public | Login |
| `POST` | `/api/auth/logout` | Public | Logout |
| `POST` | `/api/auth/forgot-password` | Public | Request password reset |
| `POST` | `/api/auth/reset-password` | Public | Reset password |
| `GET` | `/api/users/me` | JWT | Current user + profile |
| `PUT` | `/api/users/me` | JWT | Update profile |
| `PUT` | `/api/users/me/password` | JWT | Change password |
| `DELETE` | `/api/users/me` | JWT | Delete account |
| `GET` | `/api/users` | Admin | List users (paginated) |
| `DELETE` | `/api/users/:id` | Admin | Delete user |
| `GET` | `/api/users/:id` | JWT | Public profile |
| `GET` | `/api/jobs/search` | JWT | Search jobs |
| `GET` | `/api/jobs` | JWT | List / filter jobs |
| `GET` | `/api/jobs/:id` | JWT | Job details |
| `POST` | `/api/jobs` | Employer | Create job |
| `PUT` | `/api/jobs/:id` | Employer | Update job |
| `DELETE` | `/api/jobs/:id` | Employer | Delete job |
| `POST` | `/api/apply/:job_id` | Jobseeker | Apply for job |
| `POST` | `/api/applications/:jobId` | Jobseeker | Apply (alias) |
| `GET` | `/api/applications` | Jobseeker | My applications |
| `GET` | `/api/applications/me` | Jobseeker | My applications (alias) |
| `DELETE` | `/api/applications/:id` | Jobseeker | Withdraw application |
| `GET` | `/api/applications/job/:job_id` | Employer | View applicants |
| `PATCH` | `/api/applications/:id/status` | Employer | Accept / reject |
| `GET` | `/api/all_notifications` | JWT | All active notifications |
| `GET` | `/api/notifications/all` | JWT | Same as above |
| `GET` | `/api/notifications` | JWT | Notifications (paginated) |

**Roles:** `jobseeker` · `employer` · `admin`

---

## Features

| Feature | Details |
| :--- | :--- |
| **Authentication** | JWT (7 days), bcrypt passwords, email password reset |
| **Profiles** | Separate jobseeker & employer profiles, auto-created on register |
| **Jobs** | Full CRUD for employers; search by title, location, salary, date posted |
| **Applications** | Apply, withdraw, employer review, accept/reject |
| **Notifications** | In-app (24h expiry) + email for new applications & status updates |
| **Pagination** | `page` & `limit` on all list endpoints (default 10, max 100) |

---

## Tech Stack

Node.js (ES modules) · Express 5 · PostgreSQL · JWT · bcrypt · express-validator · Nodemailer

---

## Project Structure

```
backend/
├── app.js
├── package.json
└── app/
    ├── auth/
    ├── users/
    ├── jobs/
    ├── applications/
    │   ├── apply.routes.js
    │   ├── applications.routes.js
    │   ├── applications.controller.js
    │   ├── applications.model.js
    │   └── applications.utils.js
    ├── notifications/
    │   ├── notifications.routes.js       # GET /, GET /all
    │   ├── all_notifications.routes.js # GET /api/all_notifications
    │   ├── notifications.controller.js
    │   └── notifications.model.js
    └── core/
        ├── db.js
        ├── middleware.js                 # protect, restrictTo
        ├── validators.js
        ├── pagination.js
        ├── errorHandler.js
        ├── email.js                      # Reset, application status, new application
        ├── init.sql
        └── migrations/
            ├── 001_applied_status.sql
            ├── 002_salary_range.sql
            └── 003_notifications.sql
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
npm run dev          # development (nodemon)
npm start            # production
```

### Database setup

**New database:**

```bash
psql -d your_database_name -f app/core/init.sql
```

**Upgrade existing database:**

```bash
psql -d your_database_name -f app/core/migrations/001_applied_status.sql
psql -d your_database_name -f app/core/migrations/002_salary_range.sql
psql -d your_database_name -f app/core/migrations/003_notifications.sql
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
| `CLIENT_URL` | Frontend URL (reset links, notification CTAs) |
| `EMAIL_USER` / `EMAIL_PASS` | Gmail app credentials for transactional email |
| `NODE_ENV` | `development` includes error stacks in responses |

---

## Authentication

```http
Authorization: Bearer <token>
```

Tokens from `POST /api/auth/register` or `POST /api/auth/login`. Valid **7 days**.

---

## Pagination

| Param | Default | Max |
| :--- | :--- | :--- |
| `page` | `1` | — |
| `limit` | `10` | `100` |

Used on: `GET /api/jobs`, `GET /api/jobs/search`, `GET /api/applications`, `GET /api/applications/job/:job_id`, `GET /api/notifications`, `GET /api/users`.

```json
{
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 42,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

`GET /api/all_notifications` returns all active items in one response (no pagination, max 100).

---

## API Reference

### Auth — `/api/auth` (public)

| Method | Endpoint | Body |
| :--- | :--- | :--- |
| `POST` | `/register` | `name`, `email`, `password`, `role` |
| `POST` | `/login` | `email`, `password` |
| `POST` | `/logout` | — |
| `POST` | `/forgot-password` | `email` |
| `POST` | `/reset-password` | `token`, `newPassword` |

```json
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
| `PUT` | `/me/password` | JWT | Change password |
| `DELETE` | `/me` | JWT | Delete account |
| `GET` | `/` | Admin | List users |
| `DELETE` | `/:id` | Admin | Delete user |
| `GET` | `/:id` | JWT | Public profile |

**Jobseeker fields:** `bio`, `skills`, `experience`, `resume_url`, `location`

**Employer fields:** `company_name`, `company_description`, `industry`, `website`, `location`

---

### Jobs — `/api/jobs`

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/search` | JWT | Search (≥1 filter required) |
| `GET` | `/` | JWT | List all or filter |
| `GET` | `/:id` | JWT | Single job |
| `POST` | `/` | Employer | Create |
| `PUT` | `/:id` | Employer (owner) | Update |
| `DELETE` | `/:id` | Employer (owner) | Delete |

#### Create job

| Field | Required | Notes |
| :--- | :--- | :--- |
| `title`, `description`, `location`, `industry` | Yes | |
| `job_type` | Yes | `full-time`, `part-time`, `contract` |
| `salary_min`, `salary_max` | No | Integers for range filtering |
| `salary` | No | Display string |
| `deadline` | No | ISO date |

#### Search — `GET /api/jobs/search`

Requires at least one of: `title`, `location`, `min_salary`, `max_salary`, `posted_after`, `posted_before`, `posted_on`.

```http
GET /api/jobs/search?title=engineer&location=toronto&min_salary=50000&posted_after=2026-05-01&page=1&limit=10
Authorization: Bearer <token>
```

| Param | Description |
| :--- | :--- |
| `title` | Partial match on title |
| `location` | Partial match on location |
| `min_salary` | Job range reaches at least this amount |
| `max_salary` | Job starting salary ≤ this amount |
| `posted_on` | Posted on exact date (`YYYY-MM-DD`) |
| `posted_after` | Posted on or after date |
| `posted_before` | Posted on or before date |
| `page`, `limit` | Pagination |

Date filters use `jobs.created_at`.

#### Filter — `GET /api/jobs`

All search params plus:

| Param | Description |
| :--- | :--- |
| `keyword` | Alias for `title` |
| `industry` | Partial match |
| `job_type` | `full-time`, `part-time`, `contract` |

Omit filters to list all jobs (paginated).

#### Salary range

- Set `salary_min` / `salary_max` on POST/PUT.
- Filter with `min_salary` / `max_salary` (overlap logic).
- Jobs without `salary_min` are excluded when salary filters are used.

---

### Apply — `/api/apply`

| Method | Endpoint | Access |
| :--- | :--- | :--- |
| `POST` | `/:job_id` | Jobseeker |

Alias: `POST /api/applications/:jobId`

```http
POST /api/apply/5
Authorization: Bearer <token>

{ "cover_letter": "Optional, max 1000 chars" }
```

Triggers **employer** in-app notification + email. Response includes `notificationSent: true`.

---

### Applications — `/api/applications`

#### Model

| Field | Description |
| :--- | :--- |
| `id`, `job_id`, `user_id`, `status`, `cover_letter`, `applied_at` | |
| `status` | `applied` → `accepted` / `rejected` |

`user_id` in API = `jobseeker_id` in database.

#### Workflow

```
Jobseeker                    Employer                         Jobseeker
POST /api/apply/:job_id  →   GET /applications/job/:id  →   GET /api/applications
                             PATCH /:id/status
                             → notifies jobseeker
```

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Jobseeker | My applications |
| `GET` | `/me` | Jobseeker | Alias |
| `DELETE` | `/:id` | Jobseeker | Withdraw (`applied` only) |
| `GET` | `/job/:job_id` | Employer | Applicants + profiles |
| `PATCH` | `/:id/status` | Employer | `{ "status": "accepted" }` or `"rejected"` |

`PATCH` rules: must be `applied`; only `accepted`/`rejected`; employer must own job. Notifies jobseeker (in-app + email).

---

### Notifications

In-app notifications **expire after 24 hours**. Email requires Gmail env vars.

#### Triggers

| Event | Recipient | Type |
| :--- | :--- | :--- |
| New application | Employer | `new_application` |
| Accepted | Jobseeker | `application_accepted` |
| Rejected | Jobseeker | `application_rejected` |

#### Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/all_notifications` | All active notifications (max 100) |
| `GET` | `/api/notifications/all` | Same as above |
| `GET` | `/api/notifications` | Paginated (`?page=1&limit=10`) |

Access: **jobseeker** or **employer** (each sees only their own).

```http
GET /api/all_notifications
Authorization: Bearer <token>
```

```json
{
  "message": "All active notifications retrieved successfully",
  "count": 2,
  "notifications": [
    {
      "id": 1,
      "user_id": 5,
      "type": "new_application",
      "message": "Jane Doe applied for your job posting \"Software Engineer\".",
      "read": false,
      "expires_at": "2026-05-24T10:00:00.000Z",
      "created_at": "2026-05-23T10:00:00.000Z"
    },
    {
      "id": 2,
      "type": "application_accepted",
      "message": "Your application for \"Software Engineer\" was accepted by Acme Corp.",
      "read": false,
      "expires_at": "2026-05-24T12:00:00.000Z",
      "created_at": "2026-05-23T12:00:00.000Z"
    }
  ]
}
```

Expired notifications (`expires_at` in the past) are not returned. Email failures are logged but do not block the main action.

---

## Database Schema

| Table | Purpose |
| :--- | :--- |
| `users` | Accounts |
| `jobseeker_profiles` | Jobseeker profile data |
| `employer_profiles` | Employer profile data |
| `jobs` | Listings (`salary_min`, `salary_max`, `created_at`) |
| `applications` | `UNIQUE(job_id, jobseeker_id)` |
| `notifications` | `type`, `message`, `read`, `expires_at` |
| `password_reset_tokens` | 15-minute expiry |

Profiles auto-created on register for `jobseeker` and `employer`.

---

## Error Handling

| Condition | HTTP |
| :--- | :--- |
| Validation failed | 400 + `errors[]` |
| Unauthorized | 401 |
| Forbidden | 403 |
| Not found | 404 |
| Duplicate record | 409 |
| Server error | 500 |

---

## Scripts

| Command | Description |
| :--- | :--- |
| `npm start` | Production |
| `npm run dev` | Development (nodemon) |

---

## Not Yet Implemented

- Resume file upload (`resume_url` text field only)
- Mark notifications as read
- Admin dashboard beyond user management
