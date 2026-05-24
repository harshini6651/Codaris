# Codaris
### Smarter Reviews. Better Code.

Codaris is an AI-powered intelligent code review platform designed to analyze source code, identify bugs, detect security issues, suggest optimizations, and provide detailed review reports using advanced AI models.

---

## 🚀 Features

✅ AI-powered code review using Gemini AI  
✅ Rule-based validation checks  
✅ Upload source code files  
✅ Sample code generation for multiple languages  
✅ Review history with SQLite database  
✅ Search and filter review history  
✅ Delete individual reviews  
✅ Clear complete review history  
✅ Export review reports as PDF  
✅ Dashboard analytics and statistics  
✅ Copy code and AI review functionality  
✅ Modern responsive UI  

---

## 🛠 Tech Stack

### Frontend
- React.js
- Vite
- CSS
- jsPDF

### Backend
- FastAPI
- Python
- SQLAlchemy
- SQLite
- Gemini API
- Uvicorn

---

# 📌 Problem Statement

Manual code reviews consume significant time and may overlook bugs, security vulnerabilities, and optimization opportunities.

Codaris automates code review using AI to improve software quality and reduce development effort.

---

# 🎯 Objectives

The main objectives of Codaris are:

- Improve code quality
- Detect security vulnerabilities
- Reduce manual review effort
- Suggest optimized code improvements
- Store and analyze historical reviews
- Generate downloadable review reports

---

# ⚙ Modules

## 1. Code Input Module
Users can:

- Upload code files
- Paste source code
- Load sample code

Supported languages:

- Python
- Java
- JavaScript
- C
- C++

---

## 2. AI Review Module

Generates:

- Summary
- Bugs detection
- Security issues
- Code quality improvements
- Time complexity
- Space complexity
- Optimized code suggestions

Powered by:

```txt
Gemini 2.5 Flash
```

---

## 3. Rule Engine

Performs checks for:

- Empty code
- Short code
- Sensitive information
- Invalid inputs

---

## 4. Review History Module

Stores:

```txt
Language
Code
AI Review
Timestamp
```

Uses:

```txt
SQLite Database
```

---

## 5. Dashboard Module

Displays:

- Total reviews
- Python reviews
- Java reviews
- Latest review date

---

## 6. Export Module

Exports:

```txt
AI Review → PDF Report
```

---

# 🏗 System Architecture

```txt
User Input
     ↓
React Frontend
     ↓
FastAPI Backend
     ↓
Rule-Based Validation
     ↓
Gemini AI Model
     ↓
SQLite Database
     ↓
Review History
     ↓
AI Review Output
```

---

# 📂 Project Structure

```txt
Codaris/
│
├── backend/
│      ├── main.py
│      ├── reviews.db
│      ├── .env
│      └── venv/
│
├── frontend/
│      ├── src/
│      ├── package.json
│      └── App.jsx
│
└── README.md
```

---

# ⚙ Installation

## Backend Setup

Create virtual environment:

```bash
python -m venv venv
```

Activate:

Windows:

```bash
.\venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run backend:

```bash
python -m uvicorn main:app --reload
```

Backend:

```txt
http://127.0.0.1:8000
```

---

## Frontend Setup

Install packages:

```bash
npm install
```

Run:

```bash
npm run dev
```

Frontend:

```txt
http://localhost:5173
```

---

# 📊 Dashboard Metrics

Codaris tracks:

- Total reviews
- Reviews by language
- Recent reviews
- Historical review analytics

---

# 🔮 Future Enhancements

Potential improvements:

- User authentication
- Cloud deployment
- Team collaboration
- Multiple AI models
- VS Code extension
- Real-time code execution
- CI/CD integration

---

# 📸 Screenshots

Add screenshots here.

Example:

```txt
Home Page
AI Review
Dashboard
History Module
PDF Export
```

---

# 📈 Outcome

Codaris helps developers:

✔ Write better code  
✔ Detect issues faster  
✔ Improve productivity  
✔ Maintain review history  
✔ Generate intelligent review reports  

---

# 👨‍💻 Developed By

S.Lalitha Sri Harshini

---

# ⭐ Tagline

**Codaris**

### *Smarter Reviews. Better Code.*
