# CampusHire

A **full-stack Campus Placement Management System** designed to automate and manage the complete campus recruitment process between **Students, Colleges, and Companies**.

This project implements **real-world placement workflows**, **role-based access control**, and **analytics-driven PDF reports**, making it suitable for both **academic use** and **industry-level demonstration**.

---

## About the Project

CampusHire digitalizes the placement process by providing separate dashboards for students, colleges, and companies.  
It ensures secure job postings, controlled approvals, fair student applications, and detailed placement analytics.

---

## Features

### 👨 Student Module
- Secure registration & login
- View **approved jobs** for their college only
- Apply for jobs with eligibility checks (CGPA, branch, blacklist)
- Prevents duplicate applications
- Track application status:
  - APPLIED
  - SHORTLISTED
  - REJECTED
  - HIRED
- Update skills and profile
- Automatically restricted from applying after placement

---

### 🏫 College Module
- College profile management
- Review and approve/reject company job postings
- View all registered students
- Blacklist / Unblacklist students
- Placement analytics dashboard
- **Year-wise Placement Report (PDF)**:
  - Total students
  - Placed vs unplaced
  - Companies visited
  - Branch-wise placement statistics
  - Complete list of placed students with company & salary

---

### 🏢 Company Module
- Company registration & profile
- Create jobs for specific colleges
- Edit or delete jobs until approval
- View applicants per job
- Shortlist, reject, or hire students
- **Year-wise Recruitment Report (PDF)**:
  - Total applications
  - College-wise applicant distribution
  - Shortlisted & hired counts
  - Complete list of hired students (name, college, branch, email)

---

### 📊 Reports & Analytics (Key Highlight)
- Automated **PDF report generation**
- Year-wise filtering
- Optimized MongoDB aggregation pipelines
- Analytics-ready data model for fast reporting

---

## 🧠 System Workflow

Company → Post Job → College Approval → Student Views Job → Student Applies → Company Shortlists / Hires

---

## 🛠 Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- PDFKit (PDF generation)

### Frontend
- EJS Templates
- Vanilla JavaScript
- HTML / CSS

### Concepts Used
- MVC Architecture
- Role-Based Access Control
- MongoDB Aggregation Pipelines
- Denormalized schema for analytics
- Secure cookie-based authentication

---

## 📁 Project Structure

```text
CampusHire/
├── config/
├── controller/
│   ├── auth/
│   ├── college/
│   ├── company/
│   └── student/
├── middleware/
├── models/
├── routes/
│   ├── auth/
│   ├── college/
│   ├── company/
│   ├── student/
│   └── page/
├── services/
├── src/
├── views/
│   ├── auth/
│   ├── college/
│   ├── company/
│   └── student/
└── server.js
```


## 📸 Screenshots

Screenshots are available in the **/screenshots** folder.

---

## 🔐 Authentication & Security

- JWT-based authentication
- Role-based route protection
- Secure access to sensitive APIs

---

## 📊 Database Design Highlights

- Separate collections for:
  - Users
  - Students
  - Colleges
  - Companies
  - Jobs
  - Applications
- Applications collection is **denormalized** with `collegeId` and `companyId` for fast analytics
- Indexed fields for optimized reporting performance

---

## 🎯 Real-World Use Cases

- Campus placement automation
- Training & placement cell management
- Recruitment analytics for companies
- Academic audits and accreditation reporting


---

## Author

**Raj Ghoniya**  
B.Tech Student | Full-Stack Developer  

📧 Email: raj317073b@gmail.com  
🔗 GitHub: https://github.com/raj2911-tech  
🔗 LinkedIn: https://linkedin.com/in/raj-ghoniya-106506283 
