# 🚀 Resume Analyzer with AI Feedback

A full-stack web application that analyzes resumes, provides intelligent feedback, and matches them with job descriptions.

---

## 📌 Overview

This project helps users evaluate their resumes by giving a score, identifying skills, and suggesting improvements. It also includes a job matching feature to simulate how Applicant Tracking Systems (ATS) work.

---

## ✨ Features

- 📊 Resume scoring system
- 🧠 AI-style feedback and suggestions
- 🔍 Job description matching (ATS simulation)
- 🎨 Modern interactive UI
- 📂 Drag & drop resume upload
- ⚡ Real-time analysis

---

## 🛠️ Tech Stack

### Frontend
- React
- Tailwind CSS
- Framer Motion

### Backend
- Python
- Flask

### Libraries
- PyPDF2
- Axios

---

## ⚙️ How It Works

1. User uploads a resume (PDF)
2. Backend extracts text and analyzes:
   - Skills
   - Resume length
   - Sections
3. System generates:
   - Score
   - Suggestions
   - AI feedback
4. Optional: Compare with job description
5. Results displayed on interactive dashboard

---

## 📁 Project Structure

resume-analyzer/
│
├── backend/
│ └── app.py
│
├── frontend/
│ └── src/
│ └── App.js
│
└── README.md

---

## 🚀 Setup Instructions

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/resume-analyzer.git
cd resume-analyzer

### 2️⃣Backend Setup

cd backend
pip install flask flask-cors PyPDF2
python app.py

Backend runs at:
http://127.0.0.1:5000

###3️⃣ Frontend Setup

Frontend runs at:
http://localhost:3000
