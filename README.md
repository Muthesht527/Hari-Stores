# Hari Enterprises

Production-ready full-stack e-commerce application with Firebase authentication, role-based admin access, MongoDB, and Razorpay payments.

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, Axios, React Router
- Backend: Node.js, Express, MongoDB, Mongoose
- Auth: Firebase Authentication + backend JWT
- Payments: Razorpay
- Uploads: Multer local uploads

## 1. Backend Setup

```bash
cd backend
npm.cmd install
copy .env.example .env
```

Fill in `.env` with MongoDB, Firebase Admin, JWT, Razorpay, and frontend URL values, then run:

```bash
npm run dev
```

Backend runs on `http://localhost:5000`.

### Optional: import sample data

```bash
Use the JSON files in `backend/datasets/`
```

Collections provided:

- `users.json`
- `products.json`
- `orders.json`

These files are import-ready for MongoDB tools such as Atlas UI, MongoDB Compass, or `mongoimport`.

Important:

- The sample `users` are demo records only.
- Real app login still happens through Firebase.
- `orders.json` references the sample user/product `_id` values, so import all three files together if you want linked demo orders.

## 2. Frontend Setup

```bash
cd frontend
npm.cmd install
copy .env.example .env
```

Fill in Firebase web config, `VITE_API_BASE_URL`, and `VITE_RAZORPAY_KEY_ID`, then run:

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`.

## Firebase Auth Setup

Enable these providers in Firebase Authentication:

- Google
- Phone

For backend token verification:

1. Open Firebase project settings.
2. Go to `Service accounts`.
3. Generate a private key.
4. Copy `project_id`, `client_email`, and `private_key` into `backend/.env`.

## Razorpay Setup

1. Create a Razorpay account.
2. Copy `KEY_ID` and `KEY_SECRET` into `backend/.env`.
3. Copy only `KEY_ID` into `frontend/.env` as `VITE_RAZORPAY_KEY_ID`.

## Admin User

Users are created on first login through Firebase. To make an admin:

1. Log in once.
2. Open the `users` collection in MongoDB.
3. Change `role` from `user` to `admin`.

## Production Notes

- Keep Razorpay secret and Firebase Admin credentials only on the backend.
- Use a strong `JWT_SECRET`.
- Restrict `FRONTEND_URL`.
- Use HTTPS in production.
- Replace local uploads with cloud storage if needed later.
