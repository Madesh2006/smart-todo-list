

A full-stack task management application with a React/Vite frontend, FastAPI backend, MySQL database, and JWT authentication.

## Features
- User registration and login
- Password hashing (Argon2)
- Create, edit, complete, and delete tasks
- Priority, category, due date, and description
- Search and pending/completed/overdue filters
- Task statistics and completion progress
- Dark responsive UI

## Requirements
- Python 3.11+
- Node.js 20+
- MySQL 8+

## 1. Create the MySQL database

Open MySQL Workbench or a MySQL shell and run:

```sql
CREATE DATABASE smart_todo CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'todo_user'@'localhost' IDENTIFIED BY 'change_this_password';
GRANT ALL PRIVILEGES ON smart_todo.* TO 'todo_user'@'localhost';
FLUSH PRIVILEGES;
```

Use a strong password and update the database URL accordingly. If your MySQL host is not `localhost`, update the host in the URL.

## 2. Start the backend

Open a terminal in `backend/`.

Windows PowerShell:
```powershell
py -m venv .venv
.venv\\Scripts\\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
```

Edit `backend/.env` with your database URL and a strong random `JWT_SECRET`. Example URL:

`mysql+pymysql://todo_user:YOUR_URL_ENCODED_PASSWORD@localhost:3306/smart_todo`

Generate a secret in PowerShell:
```powershell
py -c "import secrets; print(secrets.token_urlsafe(48))"
```

Run:
```powershell
uvicorn app.main:app --reload --port 8000
```

macOS/Linux:
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env and set DATABASE_URL and JWT_SECRET
uvicorn app.main:app --reload --port 8000
```

Open `http://localhost:8000/docs` to test the API and `http://localhost:8000/health` for the health check.

The backend loads `.env` automatically using `python-dotenv`. Keep secrets in `.env` locally and configure environment variables in the hosting dashboard for deployment.

## 3. Start the frontend

Open a second terminal in `frontend/`.

Windows PowerShell:
```powershell
npm install
Copy-Item .env.example .env
npm run dev
```

macOS/Linux:
```bash
npm install
cp .env.example .env
npm run dev
```

Visit `http://localhost:5173`. Register an account and start adding tasks.

## API endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create an account |
| POST | `/api/auth/login` | Sign in |
| GET | `/api/auth/me` | Current user |
| GET | `/api/tasks` | List/search/filter tasks |
| POST | `/api/tasks` | Create task |
| PATCH | `/api/tasks/{id}` | Update task |
| DELETE | `/api/tasks/{id}` | Delete task |
| GET | `/api/tasks/stats` | Dashboard statistics |

Task list filters: `?status=all|pending|completed|overdue&search=term`

## Deployment overview

### Backend on Render
1. Push this project to GitHub.
2. Create a new Render **Web Service** from the repository and set its root directory to `backend`.
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables: `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRE_MINUTES=60`, and `FRONTEND_ORIGIN=https://YOUR-FRONTEND.vercel.app`.
6. Attach a managed MySQL database from a provider that supports external connections. Render's built-in managed database offering is PostgreSQL, not MySQL, so use a separate MySQL provider or your own managed MySQL server. Use its externally reachable connection URL and allow the Render service to connect.

### Frontend on Vercel
1. Import the GitHub repository into Vercel.
2. Set the project root directory to `frontend`.
3. Framework preset: Vite.
4. Add `VITE_API_URL=https://YOUR-BACKEND.onrender.com` (no trailing slash).
5. Deploy.
6. Update backend `FRONTEND_ORIGIN` to the exact deployed frontend origin and redeploy/restart the backend.

### Important deployment notes
- Never commit `.env` files or secrets to GitHub.
- Set a unique, strong `JWT_SECRET` in production.
- Use HTTPS in production.
- Configure MySQL backups and restrict database access.
- This starter stores the access token in `localStorage`, which is convenient for a student project but more exposed to cross-site scripting than an HttpOnly secure cookie. For production use, consider an HttpOnly/Secure/SameSite cookie setup and additional hardening.
- `Base.metadata.create_all()` is used for easy development startup. For production schema changes, add Alembic migrations.
- Due-date validation in the UI prevents choosing past dates when creating/editing, but API clients can still submit past dates; this is intentional so overdue tasks can be represented.
=======
# smart-todo-list
Advanced To-Do List Application
>>>>>>> 76049899036784551dc92c9504e07ebc916ba3da
