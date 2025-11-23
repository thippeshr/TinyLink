# 🔗 TinyLink – URL Shortener (Node.js + PostgreSQL)

TinyLink is a simple full-stack URL shortener application that lets users:
- Create custom short URLs  
- Redirect using short codes  
- Track clicks  
- View last clicked time  
- Manage (delete) existing short links  

This project includes:
- **Backend:** Node.js + Express + PostgreSQL  
- **Frontend:** Simple HTML + CSS + JavaScript UI  
- **Database:** NeonDB PostgreSQL  

---

## 🚀 Features

- Create short links with custom codes  
- Auto-redirect using short codes  
- Track number of clicks  
- Track last click timestamp  
- Simple dashboard to create, list, delete links  
- REST API with JSON  
- PostgreSQL database  

---

## 📁 Project Structure

A simple URL shortener using Node.js, Express, and PostgreSQL with a clean HTML dashboard.

---

## 🚀 How to Run the Project

### 1️⃣ Install Dependencies
npm install

### 2️⃣ Create `.env` file in the project root


Example:
DATABASE_URL=postgres://your-username:your-password@your-host/your-db
PORT=5000

### 3️⃣ Create Database Table
Run:
schema.sql

CREATE TABLE links (
  id SERIAL PRIMARY KEY,
  url TEXT NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  clicks INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_clicked TIMESTAMP
);

### 4️⃣ Start Backend
node index.js

Backend runs at:
http://localhost:5000

### 5️⃣ Start Frontend
Open:
index.html

Your dashboard will load and connect automatically.


