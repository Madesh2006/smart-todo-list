<div align="center">

# ✨ Focus — Smart To-Do List

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=18&duration=3000&pause=1000&color=38BDF8&center=true&vCenter=true&width=550&lines=Full-Stack+Task+Management+Application;React+%2B+Vite+%7C+FastAPI+%7C+MySQL+%7C+JWT;Clean+Architecture+%7C+Modern+Dark+UI" alt="Typing SVG" />
</p>

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python_3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![MySQL](https://img.shields.io/badge/MySQL_8+-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)

<br/>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" width="100%" />

</div>

> A full-stack task management application with a **React/Vite** frontend, **FastAPI** backend, **MySQL** database, and **JWT authentication**.

---

## ⚡ Features

* 🔐 **User registration and login**
* 🛡️ **Password hashing (Argon2)**
* 📝 **Create, edit, complete, and delete tasks**
* 🏷️ **Priority, category, due date, and description**
* 🔍 **Search and pending/completed/overdue filters**
* 📊 **Task statistics and completion progress**
* 🌙 **Dark responsive UI**

---

## 📋 Requirements

* 🐍 **Python 3.11+**
* 🟢 **Node.js 20+**
* 🐬 **MySQL 8+**

---

## 🚀 Setup & Installation

### 1. Create the MySQL Database

Open MySQL Workbench or a MySQL shell and run:

```sql
CREATE DATABASE smart_todo CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'todo_user'@'localhost' IDENTIFIED BY 'change_this_password';
GRANT ALL PRIVILEGES ON smart_todo.* TO 'todo_user'@'localhost';
FLUSH PRIVILEGES;
