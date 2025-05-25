# 🔐 Authentication App

A full-featured authentication system built with **Next.js 14 (App Router)**, **Tailwind CSS**, **ShadCN UI**, **Express.js**, and **MongoDB**. It includes user signup, OTP verification, login, forgot/reset password, and protected routes with toast notifications and token handling.

---

## 🌟 Features

- ✅ Signup with username, email, password & confirm password
- ✅ Email-based OTP verification after signup
- ✅ Login with JWT authentication and secure session
- ✅ Forgot password functionality
- ✅ OTP-based password reset with confirm password
- ✅ React Hot Toast notifications
- ✅ Resend OTP support
- ✅ Authentication check via `ClientProvider`
- ✅ Full CORS support for backend with secure token handling

---

## 🧱 Tech Stack

### Frontend

- **Next.js 14** (App Router)
- **Tailwind CSS**
- **ShadCN UI**
- **React Hot Toast**
- **Axios**

### Backend

- **Express.js**
- **MongoDB + Mongoose**
- **JWT (jsonwebtoken)**
- **Nodemailer** (for OTP emails)
- **CORS & dotenv**

---

## 📁 Folder Structure
authentication-app/
│
├── backend/
│ ├── controllers/
│ ├── routes/
│ ├── models/
│ ├── utils/
│ └── server.js
│
├── frontend/
│ ├── app/
│ │ ├── auth/
│ │ │ ├── signup/page.tsx
│ │ │ ├── login/page.tsx
│ │ │ └── verify/page.tsx
│ │ ├── forgot-password/page.tsx
│ │ ├── reset-password/page.tsx
│ │ ├── dashboard/page.tsx
│ │ └── layout.tsx
│ ├── components/
│ ├── hoc/ClientProvider.tsx
│ ├── lib/axios.ts
│ ├── styles/
│ └── public/screenshots/
│
└── README.md


---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/authentication-app.git
cd authentication-app
## Backend Setup

cd backend
npm install

## Create a .env file:

PORT=8000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
CLIENT_URL=http://localhost:3000

3. Frontend Setup
Navigate to the frontend folder:

cd ../frontend
npm install
Create a .env.local file:

NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
Start the frontend:
npm run dev

