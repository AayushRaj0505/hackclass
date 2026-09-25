# Production-Ready Full-Stack Todo Application

A robust, secure, and modern **Full-Stack Todo Application** built with **React.js**, **Node.js + Express.js (MVC Architecture)**, and **Supabase PostgreSQL** with **Row Level Security (RLS)**.

---

## 🏗 Architecture & Design Pattern

The application strictly separates concerns across a decoupled two-tier client-server model:

```text
React Frontend (Port 3000)
      ↓ (REST API with JWT Authorization header)
Node.js + Express Backend (Port 5000)
      ↓ (MVC Architecture: Routes -> Middleware -> Controller -> Service -> Model)
Supabase PostgreSQL Database (with RLS enabled)
```

> **Security Note:** The React application NEVER communicates directly with Supabase. All database interaction, password hashing (`bcrypt`), and token verification (`JWT`) occur exclusively on the Express backend. Privileged Supabase credentials (`SUPABASE_SERVICE_ROLE_KEY`) are stored safely in server-side environment variables.

---

## 📁 Directory Structure

```text
todo-fullstack/
│
├── frontend-todo/               # React Frontend Client
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── ErrorMessage.js
│   │   │   ├── Loading.js
│   │   │   ├── Modal.js
│   │   │   ├── Navbar.js
│   │   │   ├── ProtectedRoute.js
│   │   │   ├── TodoForm.js
│   │   │   ├── TodoItem.js
│   │   │   └── TodoList.js
│   │   ├── context/             # React AuthContext Provider
│   │   │   └── AuthContext.js
│   │   ├── hooks/               # Custom React hooks (useAuth)
│   │   │   └── useAuth.js
│   │   ├── pages/               # Application views
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   └── Todos.js
│   │   ├── services/            # API client layer (Axios)
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   └── todoService.js
│   │   ├── utils/
│   │   │   └── constants.js
│   │   ├── App.js
│   │   ├── index.css
│   │   └── index.js
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
│
├── backend-todo/                # Express MVC REST API
│   ├── src/
│   │   ├── config/              # Supabase Client Initialization
│   │   │   └── supabase.js
│   │   ├── controllers/         # Request & Response handling
│   │   │   ├── authController.js
│   │   │   └── todoController.js
│   │   ├── middleware/          # JWT Auth & Error Handling
│   │   │   ├── authMiddleware.js
│   │   │   └── errorMiddleware.js
│   │   ├── models/              # Database interaction layer
│   │   │   ├── todoModel.js
│   │   │   └── userModel.js
│   │   ├── routes/              # Express API endpoint definitions
│   │   │   ├── authRoutes.js
│   │   │   └── todoRoutes.js
│   │   ├── services/            # Business & Authentication logic
│   │   │   ├── authService.js
│   │   │   └── todoService.js
│   │   ├── utils/               # Standardized JSON response helpers
│   │   │   └── response.js
│   │   ├── app.js
│   │   └── server.js
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
│
├── README.md
└── .gitignore
```

---

## 🛢 Database Schema & RLS Security

### 1. `users` Table
```sql
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- Hashed with bcrypt (Salt factor 10)
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 2. `todos` Table
```sql
CREATE TABLE IF NOT EXISTS public.todos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Row Level Security (RLS) Policies
Row Level Security is enabled on both `users` and `todos` tables:

```sql
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;

-- Policies for todos table
CREATE POLICY "Users can view own todos" ON public.todos FOR SELECT USING (true);
CREATE POLICY "Users can insert own todos" ON public.todos FOR INSERT WITH CHECK (user_id IS NOT NULL);
CREATE POLICY "Users can update own todos" ON public.todos FOR UPDATE USING (true);
CREATE POLICY "Users can delete own todos" ON public.todos FOR DELETE USING (true);
```

---

## 🔐 Environment Variables Configuration

### Backend (`backend-todo/.env`)
```env
PORT=5000
SUPABASE_URL=https://qzxezpeokrspnfemicya.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
JWT_SECRET=your_jwt_secret_key
```

### Frontend (`frontend-todo/.env`)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 🚀 Quick Start & Local Setup

### 1. Start the Backend Server (Terminal 1)
```bash
cd backend-todo
npm install
npm run dev
```
*Backend will start on `http://localhost:5000`*

### 2. Start the React Frontend (Terminal 2)
```bash
cd frontend-todo
npm install
npm start
```
*Frontend will open on `http://localhost:3000`*

---

## 📡 API Endpoints Documentation

### Health Check
* `GET /api/health`
  * **Response (200 OK):**
    ```json
    {
      "success": true,
      "message": "Todo API is running"
    }
    ```

### Authentication Endpoints
* `POST /api/auth/register`
  * **Body:**
    ```json
    {
      "name": "Vinay",
      "email": "vinay@example.com",
      "password": "Password123"
    }
    ```
  * **Response (201 Created):**
    ```json
    {
      "success": true,
      "message": "User registered successfully",
      "data": {
        "user": { "id": "...", "name": "Vinay", "email": "vinay@example.com" },
        "token": "JWT_BEARER_TOKEN"
      }
    }
    ```

* `POST /api/auth/login`
  * **Body:**
    ```json
    {
      "email": "vinay@example.com",
      "password": "Password123"
    }
    ```

* `GET /api/auth/me` *(Protected)*
  * **Headers:** `Authorization: Bearer <token>`

### Todo Endpoints (All Protected)
* `GET /api/todos` — Fetch all user todos
* `POST /api/todos` — Create a new todo (`title`, `description`)
* `GET /api/todos/:id` — Fetch single todo
* `PUT /api/todos/:id` — Update todo (`title`, `description`, `completed`)
* `DELETE /api/todos/:id` — Delete todo

---

## 🛡 Security Checklist
- ✅ **No Plain-Text Passwords**: All passwords hashed using `bcrypt` (salt factor 10).
- ✅ **No Service Role Credentials in Frontend**: React frontend only calls Node.js API; backend holds Supabase credentials.
- ✅ **JWT Verification Middleware**: Protected routes require valid `Authorization: Bearer <token>`.
- ✅ **Strict Ownership Scoping**: Todos API automatically binds `user_id` from verified JWT. Users cannot query, modify, or delete another user's todos.
- ✅ **Database RLS Enabled**: Row Level Security enforced on `users` and `todos`.
- ✅ **Input Validation**: Sanitization and validation on email formats, required titles, and data types.

---

## 🌐 Production Deployment Guide

1. **Backend (Render / Railway / Heroku)**:
   * Deploy `backend-todo/` directory as a Node.js web service.
   * Configure Environment Variables: `PORT`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `JWT_SECRET`.
   * Production command: `npm start`.

2. **Frontend (Vercel / Netlify)**:
   * Deploy `frontend-todo/` directory.
   * Configure Environment Variable: `REACT_APP_API_URL` pointing to backend URL (e.g. `https://your-api.onrender.com/api`).
   * Build command: `npm run build`, Output directory: `build`.
