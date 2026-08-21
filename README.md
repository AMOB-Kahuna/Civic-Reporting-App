# 🏙️ Civic Reporting Application

[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-5.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database_%26_Auth-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![YouTube Demo](https://img.shields.io/badge/YouTube-Watch_Demo-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://youtu.be/LA9JEXvufiU)

A modern, full-stack civic engagement platform designed for citizens to report municipal and public safety issues directly to local government authorities. The application empowers communities to submit incidents with photographic evidence and location metadata while providing city administrators with a real-time management console and analytics dashboard to track and resolve civic reports efficiently.

▶️ **[Watch the YouTube Video Demo](https://youtu.be/LA9JEXvufiU)**

---

## 🚀 Features

### 📢 Citizen Reporting Portal
- **Category & Sub-Category Selection**: Organized classification across *Infrastructure* (Potholes, Road Damage, Broken Streetlights), *Public Safety* (Suspicious Activity, Reckless Driving, River Overflow), and *Cleanliness* (Illegal Dumping, Bad Odours, Drainage Issues).
- **Photographic Evidence Upload**: Seamless image attachment support powered by Express Multer memory storage and Supabase Storage buckets.
- **Location Tagging**: Precise address tag input for accurate municipal dispatching.

### 📊 Real-Time Analytics & Dashboard
- **Aggregate Metrics**: Live tracking of Total Reports, Open/New Issues, and Closed/Resolved Incidents.
- **Category Breakdown**: Dynamic frequency breakdown of reported issue types ranked by volume.

### 🔍 Incident Explorer & Search Engine
- **Fuzzy Search**: Filter reports by street name, landmark, or location query.
- **Status Filter**: Real-time filtering by resolution status (`New / Open`, `In Progress`, `Closed / Resolved`).
- **Detailed Incident View**: Dedicated report detail page showcasing incident image evidence, categorization, location, and submission timestamp.

### 🛡️ Admin Management & Verification Console
- **Guarded Portal**: Protected admin route (`/admin`) secured via Supabase Auth (`AuthContext` + `ProtectedRoute`).
- **Status Lifecycle Control**: Instant resolution status updates (`new` ➔ `in_progress` ➔ `closed`).
- **Automated Resource Cleanup**: Authenticated deletion workflow that removes database records alongside associated image files from Supabase Storage buckets with user-friendly toast feedback.

---

## 🛠️ Technology Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend Framework** | React 19 + Vite | Fast HMR web client built with functional components & hooks |
| **Routing** | React Router DOM v7 | Dynamic client-side routing & protected admin route guards |
| **Styling & UI** | Tailwind CSS v4 + Lucide React | Responsive layout design, modern glassmorphism & UI icons |
| **Backend API** | Node.js + Express 5 | RESTful Express routing, middleware logging & CORS support |
| **File Uploads** | Multer | In-memory multipart form-data parser for media upload |
| **Database & Storage** | Supabase Postgres & Storage | Scalable SQL database & public object storage buckets |
| **Authentication** | Supabase Auth | Email/Password administrative authentication system |

---

## ⚙️ Environment Configuration

### Backend Configuration (`backend/.env`)

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
SUPABASE_URL=https://your-supabase-project.supabase.co
SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-or-service-key
```

### Frontend Configuration (`frontend/.env`)

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

---

## 🗄️ Database & Storage Setup (Supabase)

### 1. Database Table Schema (`reports`)

Run the following SQL snippet in your Supabase SQL Editor:

```sql
CREATE TABLE public.reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  sub_category TEXT NOT NULL,
  urgency INTEGER DEFAULT 0,
  description TEXT NOT NULL,
  address TEXT NOT NULL,
  img TEXT,
  verification_status TEXT DEFAULT 'unverified',
  resolution_status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) or configure appropriate permissions
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Allow public read access to reports
CREATE POLICY "Allow public read access" ON public.reports
  FOR SELECT USING (true);

-- Allow public report creation
CREATE POLICY "Allow public insert access" ON public.reports
  FOR INSERT WITH CHECK (true);

-- Allow authenticated admins full access
CREATE POLICY "Allow authenticated full access" ON public.reports
  FOR ALL USING (auth.role() = 'authenticated');
```

### 2. Storage Bucket Setup

Create a public storage bucket named **`images`** in Supabase Storage with public access enabled for serving report evidence photos.

---

## 🏃 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/)
- A [Supabase](https://supabase.com/) project

### 1. Clone the Repository

```bash
git clone https://github.com/AMOB-Kahuna/Civic-Reporting-App.git
cd Civic-Reporting-App
```

### 2. Start the Backend API Server

```bash
cd backend
npm install
npm run dev
```
The server will start at `http://localhost:5000`.

### 3. Start the Frontend Application

Open a second terminal window:

```bash
cd frontend
npm install
npm run dev
```
The client application will start at `http://localhost:5173`.

---

## 🔌 API Endpoint Documentation

| Method | Endpoint | Description | Request Body / Parameters |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/reports` | Retrieve all submitted civic reports | None |
| `POST` | `/api/reports` | Submit a new civic report with image | Multipart Form (`image`, `category`, `sub_category`, `description`, `address`) |
| `GET` | `/api/reports/search` | Search and filter reports | Query parameters: `keyword` (location search), `filter` (`new`, `in_progress`, `closed`) |
| `GET` | `/api/reports/:id` | Fetch full details for a specific report | URL parameter: `id` |
| `DELETE` | `/api/reports/:id` | Delete a report and its image assets (Admin) | Header: `Authorization: Bearer <token>` |

---

## 🔐 Administrative Access

City administrators can access the admin management center by navigating to `/login` and logging in with registered Supabase Auth credentials. Once authenticated:
- Access `/admin` to view status breakdown counters.
- Transition report resolution statuses in real time.
- Purge invalid or duplicate reports and associated images.

---

## 📄 License

Distributed under the ISC License. See `LICENSE` for more information.

---

## 👥 Authors & Acknowledgments

Developed by **AMOB** ([@AMOB-Kahuna](https://github.com/AMOB-Kahuna)) as a modern solution for community civic engagement and public service improvement.
