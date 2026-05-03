# SMS Frontend

A school management system frontend built with React, Vite, and Tailwind CSS. Supports three roles — Admin, Teacher, and Student — each with their own dashboard and features.

---

## Tech Stack

- **React 19** — UI library
- **Vite** — build tool and dev server
- **Tailwind CSS v4** — styling
- **TanStack Query** — server state and data fetching
- **React Router v7** — client-side routing
- **React Hook Form + Zod** — form handling and validation
- **Axios** — HTTP client
- **Framer Motion** — animations
- **Sonner** — toast notifications
- **Luxon** — date formatting

---

## Prerequisites

- Node.js 18+
- The backend API running (see backend repo)

---

## Getting Started

**1. Clone and install**

```bash
git clone <repo-url>
cd student-frontend
npm install
```

**2. Set up environment variables**

Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:5000
```

**3. Start the dev server**

```bash
npm run dev
```

The app runs at `http://localhost:5173` by default.

---

## Available Scripts

| Script            | Description                      |
| ----------------- | -------------------------------- |
| `npm run dev`     | Start development server         |
| `npm run build`   | Build for production             |
| `npm run preview` | Preview production build locally |
| `npm run lint`    | Run ESLint                       |

---

## Project Structure

```
src/
├── api/            # Axios API call functions (one file per module)
├── components/     # Shared UI components (Button, Input, Dialog, Table...)
│   ├── auth/       # Route guards (RequireAuth, RequireGuest)
│   ├── form/       # Form-specific components (Select, FileInput, Label)
│   ├── table/      # Table and Pagination components
│   └── ui/         # Generic UI (Alert, Avatar, Container, Heading...)
├── context/        # React context (AuthContext, AuthProvider)
├── hooks/          # Custom hooks (useAuth, useCourse, useUser)
├── layouts/        # Role-based layouts (AdminLayout, TeacherLayout, StudentLayout)
├── lib/            # Axios instance setup
├── pages/          # All page components organized by role
│   ├── admin/
│   ├── teacher/
│   ├── student/
│   ├── guest/      # Login, forgot password, reset password
│   ├── notices/    # Shared notice components
│   └── shared/     # Shared pages (account/change password)
├── routes/         # Route definitions per role
├── schemas/        # Zod validation schemas (mirrored from backend)
└── utils/          # Helper functions (date formatting, table filters)
```

---

## Roles & Features

### Admin

- Dashboard with stats (students, teachers, courses, classes)
- Manage Classes — create, edit, delete; enroll students; assign courses; manage timetable
- Manage Courses — create, edit, delete; assign/remove teachers
- Manage Students, Teachers, Admins — create, edit, toggle active status, delete
- Manage Notices — publish notices to all users, students only, or teachers only

### Teacher

- Dashboard with today's classes, pending assignments, and attendance overview
- Schedule — view timetable for assigned classes
- Manage Attendance — mark/edit daily attendance per course
- Manage Resources — upload notes and assignments per course; view student submissions
- Manage Notices — create and manage own notices

### Student

- Dashboard with today's schedule, pending assignments, attendance summary, and recent notices
- My Courses — browse enrolled courses; view notes and submit assignments
- Schedule — view class timetable with live "current class" highlight
- Attendance — view attendance percentage per course with full history
- Notices — view all notices addressed to them

---

## Authentication

- Cookie-based JWT authentication (httpOnly cookie set by the backend)
- On app load, `/auth/me` is called to restore session
- `RequireAuth` guards role-specific routes and redirects unauthorized users
- `RequireGuest` redirects already-logged-in users away from the login page

---

## API Layer

All API calls live in `src/api/`. Each file maps to a backend module:

| File                | Module                                                      |
| ------------------- | ----------------------------------------------------------- |
| `auth.js`           | Login, logout, password reset                               |
| `manageUsers.js`    | Students, teachers, admins CRUD                             |
| `manageClasses.js`  | Classes CRUD, enroll/remove students, assign/remove courses |
| `manageCourses.js`  | Courses CRUD, assign/remove teacher                         |
| `manageSchedule.js` | Schedule and timetable entry CRUD                           |
| `attendence.js`     | Create and update attendance records                        |
| `resources.js`      | Notes and assignments CRUD                                  |
| `notices.js`        | Notices CRUD                                                |

The Axios instance in `src/lib/axios.js` reads `VITE_API_URL` from the environment and sends credentials with every request.
