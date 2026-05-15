# Job Board Platform - Team 2

A full-stack Job Board Platform built for CSC 202. This platform connects employers with job seekers.

---

##  Links
- Live App: Coming Soon
- Presentation Slides: Coming Soon

---

##  Tech Stack
- Frontend: React.js
- Backend: Node.js, Express.js, TypeScript
- Database: MongoDB

---

##  Team Members

| Name | Role |
|------|------|
| Fawaz Salimanu | Team Lead |
| Jason | Backend |
| David Alamutu | Backend |
| Hillary Ilona | Frontend |
| Muhammad Nasiru | Frontend |
| Anthony Okpuruka | DevOps |
| Tomba Bobmanuel | QA / Documentation |
| Timilehin Adeyoyin | QA / Documentation |

---

## Setup Instructions
To be added.

---

##  API Documentation
To be added.

---

##  Testing
To be added.

##  API Documentation

### Job Routes

GET /api/jobs  
Fetch all jobs

GET /api/jobs/:id  
Fetch single job

POST /api/jobs  
Create job

PUT /api/jobs/:id  
Update job

DELETE /api/jobs/:id  
Delete job

---

### Auth Routes

POST /api/users/register  
Register user

POST /api/users/login  
Login user

---

### Application Routes

POST /api/applications  
Apply to job

##  Pages

### Home Page
- Search bar
- Recently added jobs

### Job Listings
- Filter by category
- Filter by location

### Job Details
- Full job description
- Apply button

### Employer Dashboard
- View posted jobs
- View applications

### Post Job
- Create job form

### Login/Register
- User authentication
BUG:
POST /api/jobs crashes if location field is missing.

Expected:
Validation error message.

Actual:
Server crashes.
##  Screenshots

(Add screenshots here)
##  Live Demo

Frontend: https://...
Backend: https://...



# HireLink
HireLink is a full-stack job board platform designed to connect employers with job seekers efficiently. Employers can post job openings, while job seekers can browse listings and apply for positions.
This project was developed as part of the CSC 202 - Computer Programming II group project.

## Features

- User Authentication
- Job Listings
- Job Applications
- Employer Dashboard
- Search and Filtering
- Responsive User Interface
- REST API Integration

## Tech Stack

### Frontend
- React.js
- Material UI

### Backend
- Node.js
- Express.js
- TypeScript

### Database
- PostgreSQL

### Version Control
- Git & GitHub
## 👥 Team Members

| Name | Role |
|---|---|
| Fawaz Salimanu | Team Lead |
| Jason | Backend Developer |
| David Alamutu | Backend Developer |
| Hillary Ilona | Frontend Developer |
| Muhammad Nasiru | Frontend Developer |
| Anthony Okpuruka | DevOps / Integration |
| Tomba Bobmanuel | QA / Documentation |
| Timilehin Adeyoyin | QA / Documentation |

## Installation Guide

### Clone the Repository

```bash
git clone https://github.com/Faweezee/HireLink.git
```

### Navigate Into the Project

```bash
cd HireLink
```

### Install Frontend Dependencies

```bash
cd front-end
npm install
```

### Install Backend Dependencies

```bash
cd backend
npm install

##  Running the Project

### Start Backend Server

```bash
cd backend
npm run dev
```

### Start Frontend Server

```bash
cd front-end
npm start
```

##  API Endpoints

### Job Routes

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/jobs` | Fetch all jobs |
| GET | `/api/jobs/:id` | Fetch a single job |
| POST | `/api/jobs` | Create a new job |
| PUT | `/api/jobs/:id` | Update a job |
| DELETE | `/api/jobs/:id` | Delete a job |

---

### Authentication Routes

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/users/register` | Register a new user |
| POST | `/api/users/login` | Login user |

---

### Application Routes

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/applications` | Submit job application |

## Testing

Testing tools used:
- Postman
- Thunder Client

Testing includes:
- API endpoint testing
- Authentication testing
- CRUD operation testing
- End-to-end testing

## Project Status

Project is currently under active development.
## Project Structure

```bash
HireLink/
│
├── backend/          # Express + TypeScript backend
├── front-end/        # React frontend
├── README.md         # Project documentation
├── package.json
└── .gitignore
```
## Environment Variables

Create a `.env` file inside the backend folder and add the following:

```env
PORT=5000
DATABASE_URL=your_database_url
JWT_SECRET=your_secret_key
```

Make sure sensitive credentials are never pushed to GitHub.
## Contribution Guide

1. Fork the repository
2. Create a new branch

```bash
git checkout -b feature-name
```

3. Commit your changes

```bash
git commit -m "feat: add new feature"
```

4. Push to GitHub

```bash
git push origin feature-name
```

5. Open a Pull Request
##  Deployment

Frontend and backend deployment will be handled using modern cloud hosting platforms.

Suggested platforms:
- Vercel (Frontend)
- Render / Railway (Backend)
##  QA Workflow

Quality Assurance process includes:

- API endpoint validation
- Authentication testing
- CRUD functionality testing
- Frontend responsiveness testing
- End-to-end workflow testing
- Bug reporting and verification
## Bug Reporting

When reporting bugs, include:

- Bug description
- Expected behavior
- Actual behavior
- Steps to reproduce
- Screenshots (if applicable)
##  Screenshots

Screenshots will be added as development progresses.
## Future Improvements

- Resume uploads
- Email notifications
- Admin dashboard
- Advanced search filters
- Saved jobs feature
- Real-time messaging
## License

This project is for educational purposes only.


