<div align="center">

# ✨ Focus — Smart To-Do List

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=19&duration=2800&pause=1000&color=38BDF8&center=true&vCenter=true&width=600&lines=Full-Stack+Task+Management+Application;React+%2B+Vite+%7C+FastAPI+%7C+MySQL+%7C+JWT;Argon2+Security+%7C+Modern+Dark+UI;Productivity+Reimagined" alt="Typing SVG" />
</p>

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python_3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org/)
[![MySQL](https://img.shields.io/badge/MySQL_8+-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://mysql.com/)

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" width="100%" />

</div>

> A full-stack task management application with a **React/Vite** frontend, **FastAPI** backend, **MySQL** database, and **JWT authentication**.

---

## ⚡ Features

* 🔐 **Authentication & Security:** User registration and login powered by secure **JWT tokens**.
* 🛡️ **Safe Storage:** Password hashing via industry-standard **Argon2**.
* 📝 **Full Task CRUD:** Create, edit, complete, and delete tasks seamlessly.
* 🏷️ **Rich Metadata:** Organize tasks with **Priority levels**, **Categories**, **Due dates**, and **Descriptions**.
* 🔍 **Filtering & Search:** Real-time search with dedicated filters for **Pending**, **Completed**, and **Overdue** tasks.
* 📊 **Analytics:** Task completion statistics, visual indicators, and progress bars.
* 🌙 **Modern Design:** Polished, responsive **Dark UI** optimized across desktop and mobile screens.

---

## 🏗️ Architecture & Tech Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite | Component-driven SPA, fast HMR bundling |
| **Backend** | Python 3.11+, FastAPI | Asynchronous RESTful API framework |
| **Database** | MySQL 8.0+ | Relational data persistence with UTF8mb4 encoding |
| **ORM / Drivers** | SQLAlchemy / PyMySQL | Database connection and schema handling |
| **Security** | Argon2 & Python-JOSE | Modern password hashing & JSON Web Tokens |

---

## 📋 Requirements

Ensure the following tools are installed on your machine:

* 🐍 **Python 3.11+**
* 🟢 **Node.js 20+** & **npm**
* 🐬 **MySQL 8+**

---

## 📂 Project Structure

```text
smart-todo-list/
├── backend/
│   ├── app/
│   │   ├── routers/        # Auth and task endpoints
│   │   ├── models/         # Database models
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── core/           # Security, config, and DB sessions
│   │   └── main.py         # FastAPI application entrypoint
│   ├── requirements.txt    # Python dependencies
│   └── .env.example        # Environment variables template
├── frontend/
│   ├── src/
│   │   ├── components/     # Modals, inputs, and task cards
│   │   ├── pages/          # Login, Register, and Dashboard views
│   │   ├── services/       # Axios/Fetch API client
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md





---

## 🚀 Setup & Installation

### 1. Database Setup (MySQL)

Create the application database and a dedicated user:

```sql
CREATE DATABASE smart_todo CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'todo_user'@'localhost' IDENTIFIED BY 'change_this_password';
GRANT ALL PRIVILEGES ON smart_todo.* TO 'todo_user'@'localhost';
FLUSH PRIVILEGES;
