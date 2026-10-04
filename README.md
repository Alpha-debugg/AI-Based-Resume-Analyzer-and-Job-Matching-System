# ResumeIQ — AI-Based Resume Analyzer and Job Matching System

**Review 2 Prototype** &mdash; Final-Year Engineering Project

Tech stack: **React.js + Tailwind CSS** (frontend), **Node.js + Express.js** (backend),
**MongoDB** (database), **Python** (resume parsing / skill extraction), **JWT** (auth).
No Java anywhere in this project.

---

## 1. What this prototype does

```
Landing Page → Login/Register → Dashboard → Upload Resume (PDF)
   → Backend sends PDF to Python parser → Text + Skills extracted
   → Results displayed (skills, demo ATS score, extracted text)
   → Enter Job Description → Basic Match Score
   → Matched + Missing Skills shown
```

Advanced AI/ML (BERT, semantic similarity, real ATS scoring, job-portal scraping, etc.)
is intentionally **not** implemented yet — this is scoped to Review 2 only. The
architecture is modular so those features can be dropped in later without a rewrite.

---

## 2. Folder structure

```
resume-analyzer-project/
├── frontend/            React + Vite + Tailwind CSS
│   └── src/
│       ├── api/          Axios API client (all backend calls go through here)
│       ├── components/   Reusable UI components
│       ├── context/       AuthContext (JWT/user state)
│       ├── pages/         Landing, Login, Register, Dashboard, Analyzer, etc.
│       └── utils/         PrivateRoute wrapper
├── backend/              Node.js + Express + MongoDB
│   ├── config/db.js       MongoDB connection
│   ├── controllers/       Route handler logic
│   ├── middleware/        JWT auth + Multer PDF upload
│   ├── models/             User, Resume, Job, AnalysisResult (Mongoose schemas)
│   ├── routes/             /api/auth, /api/resume, /api/jobs, /api/analyze
│   └── uploads/             Uploaded PDF resumes are stored here
└── python-parser/
    ├── resume_parser.py    PDF text extraction + keyword-based skill extraction
    └── requirements.txt
```

---

## 3. Prerequisites

Install these once on your machine (or have your team lead install them):

| Tool | Version | Check with |
|---|---|---|
| Node.js | 18+ | `node -v` |
| npm | 9+ | `npm -v` |
| Python | 3.9+ | `python3 --version` |
| MongoDB | 6+ (local) or a free MongoDB Atlas cluster | `mongod --version` |

You do **not** need Java, Maven, Gradle, or any JVM tooling for this project.

---

## 4. Installation

### 4.1 Python parser dependencies

```bash
cd python-parser
pip install -r requirements.txt
# or, if pip complains about an externally-managed environment:
pip install -r requirements.txt --break-system-packages
```

Quick test (optional, confirms PyMuPDF + the parser work on your machine):

```bash
python3 resume_parser.py /path/to/any/resume.pdf
```
You should see a single line of JSON like:
```json
{"skills": ["Python", "React.js", "..."], "text": "..."}
```

### 4.2 Backend dependencies

```bash
cd backend
npm install
```

Create your `.env` file from the example:

```bash
cp .env.example .env
```

Edit `.env`:

```env
MONGO_URI=mongodb://127.0.0.1:27017/resume-analyzer
PORT=5000
JWT_SECRET=replace_with_a_long_random_string
PYTHON_PATH=python3
```

- If you're using MongoDB Atlas instead of a local database, paste your Atlas
  connection string into `MONGO_URI`.
- `PYTHON_PATH` should point to whatever command runs Python 3 on your system
  (`python3` on macOS/Linux, sometimes `python` on Windows).
- Never commit your real `.env` file — it's already in `.gitignore`.

### 4.3 Frontend dependencies

```bash
cd frontend
npm install
cp .env.example .env
```

The frontend `.env` only needs:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 5. Running the project (development)

You need **three terminals** open (Python isn't run separately — the backend
calls it automatically per upload — so really just two servers to start):

**Terminal 1 — Start MongoDB** (skip if you're using Atlas):
```bash
mongod
```

**Terminal 2 — Start the backend:**
```bash
cd backend
npm run dev
# or: npm start
```
You should see:
```
MongoDB connected successfully
Server running on http://localhost:5000
```

**Terminal 3 — Start the frontend:**
```bash
cd frontend
npm run dev
```
Open the URL Vite prints (usually `http://localhost:3000`).

The Python parser does **not** need to be started separately — `backend/utils/pythonRunner.js`
spawns it automatically each time a resume is uploaded.

---

## 6. Demo flow to show the panel

1. Open the app → Landing Page loads.
2. Click **Get Started** → Register a new account.
3. You're redirected to the **Dashboard** (stats + recent analyses).
4. Click **Analyze Resume** → drag & drop or browse a PDF resume → click **Analyze Resume**.
5. You land on the **Analysis Result** page: extracted skills as badges, a demo ATS score,
   and an expandable raw extracted text section.
6. Click **Match Against a Job** → paste a job description containing skills like
   `Python, React.js, Node.js, MongoDB, Docker, AWS` → click **Match Resume**.
7. See the **Match Score**, plus **Matched Skills** and **Missing Skills** badges.
8. Visit **History** to see all resumes analyzed so far, and **Profile** for account info.

---

## 7. API endpoints implemented

```
POST /api/auth/register
POST /api/auth/login

POST /api/resume/upload      (multipart/form-data, field name: "resume")
GET  /api/resume
GET  /api/resume/:id

POST /api/jobs
GET  /api/jobs

POST /api/analyze            { resumeId, jobId }  or  { resumeId, jobDescription }
GET  /api/analyze/:id
```

All routes except `/api/auth/*` require a JWT sent as:
```
Authorization: Bearer <token>
```
(the frontend's Axios client attaches this automatically once you're logged in).

---

## 8. Testing instructions

### Manual testing (recommended for Review 2 demo)
- Use the UI flow in Section 6 above.
- Try uploading a non-PDF file — the backend should reject it with a clear error.
- Try uploading a PDF with no recognizable skills — the results page should say
  "No known skills were detected."

### API testing with curl (optional, for the backend team member)
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123","confirmPassword":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Upload resume (replace TOKEN and path)
curl -X POST http://localhost:5000/api/resume/upload \
  -H "Authorization: Bearer TOKEN" \
  -F "resume=@/path/to/resume.pdf"
```

### Python parser testing
```bash
cd python-parser
python3 resume_parser.py /path/to/resume.pdf
```

---

## 9. Common errors and fixes

| Error | Likely Cause | Fix |
|---|---|---|
| `MongoDB connection failed` | MongoDB isn't running, or `MONGO_URI` is wrong | Start `mongod`, or double-check your Atlas connection string |
| `Failed to start Python process` | `PYTHON_PATH` in `backend/.env` doesn't match your system's Python command | Set `PYTHON_PATH=python` (Windows) or the full path from `which python3` |
| `Only PDF files are allowed` | You tried uploading a non-PDF file | Upload a `.pdf` file — other formats are rejected by design |
| `Not authorized, no token provided` | You called a protected API route without logging in first | Log in via `/api/auth/login` and include the returned token |
| CORS error in browser console | Frontend and backend ports don't match `VITE_API_BASE_URL` | Confirm backend is on port 5000 and `.env` matches |
| `ModuleNotFoundError: No module named 'pymupdf'` | Python dependency not installed | Run `pip install -r python-parser/requirements.txt` |
| Blank page on `npm run dev` (frontend) | Dependencies not installed or wrong Node version | Run `npm install` again; confirm Node 18+ with `node -v` |
| `EADDRINUSE: address already in use :::5000` | Another process is already using port 5000 | Stop that process, or change `PORT` in `backend/.env` |

---

## 10. What's intentionally left for later reviews

Per project scope, these are **not** implemented yet (architecture is ready for them):

- Advanced AI/ML models (BERT, Sentence-BERT, transformer-based semantic matching)
- TF-IDF / cosine similarity job matching (current matching is simple keyword overlap)
- Real ATS scoring algorithm (current score is a demo placeholder)
- Structured resume field extraction (name/email/phone/education parsing)
- Real job portal API integration / web scraping
- Job recommendation engine
- Production deployment configuration

---

## 11. Team notes

- Keep all secrets in `.env` files (already gitignored) — never commit real credentials.
- The Python parser is a standalone script for now; if Node → Python communication
  becomes a bottleneck later, it's designed to be lifted into its own microservice
  (e.g. a small Flask/FastAPI service) without touching the rest of the codebase.
- Each layer (frontend, backend, parser) can be developed and demoed independently.
