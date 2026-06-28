# College Digital Notice Board

A full-stack MERN web application for managing and displaying college announcements, notices, and downloadable documents.

---

## Tech Stack

**Frontend:** React + Vite + Tailwind CSS + React Router + Axios + SwiperJS + React Hot Toast  
**Backend:** Node.js + Express.js + Mongoose  
**Database:** MongoDB Atlas  
**Auth:** JWT + bcryptjs  
**File Upload:** Multer

---

## Project Structure

```
college-notice-board/
├── backend/
│   ├── config/db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── announcementController.js
│   │   ├── noticeController.js
│   │   └── downloadController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── uploadMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Announcement.js
│   │   ├── Notice.js
│   │   └── Download.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── announcementRoutes.js
│   │   ├── noticeRoutes.js
│   │   └── downloadRoutes.js
│   ├── uploads/          ← PDF and image files stored here
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── assets/
    │   ├── components/
    │   │   ├── common/
    │   │   │   ├── Navbar.jsx
    │   │   │   ├── Footer.jsx
    │   │   │   ├── HeroSlider.jsx
    │   │   │   ├── SearchBar.jsx
    │   │   │   ├── Pagination.jsx
    │   │   │   ├── CategoryBadge.jsx
    │   │   │   └── Spinner.jsx
    │   │   └── admin/
    │   │       ├── AdminSidebar.jsx
    │   │       └── AdminLayout.jsx
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   └── ThemeContext.jsx
    │   ├── pages/
    │   │   ├── HomePage.jsx
    │   │   ├── AnnouncementsPage.jsx
    │   │   ├── NoticesPage.jsx
    │   │   ├── DownloadsPage.jsx
    │   │   ├── LoginPage.jsx
    │   │   └── admin/
    │   │       ├── AdminDashboard.jsx
    │   │       ├── AdminAnnouncements.jsx
    │   │       ├── AdminNotices.jsx
    │   │       ├── AdminDownloads.jsx
    │   │       └── AdminUsers.jsx
    │   ├── services/api.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

---

## Local Setup

### 1. Clone / Download the project

```bash
cd college-notice-board
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` from `.env.example`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/college-notice-board?retryWrites=true&w=majority
JWT_SECRET=change_this_to_a_long_random_secret
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

Create the uploads directory:

```bash
mkdir uploads
```

Start the backend:

```bash
npm run dev    # development (nodemon)
npm start      # production
```

Backend runs at: http://localhost:5000

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: http://localhost:5173

The Vite dev proxy forwards `/api` and `/uploads` to the backend automatically.

---

## API Endpoints

### Auth
| Method | Endpoint              | Access  | Description       |
|--------|-----------------------|---------|-------------------|
| POST   | /api/auth/register    | Public  | Register user     |
| POST   | /api/auth/login       | Public  | Login             |
| GET    | /api/auth/profile     | Private | Get profile       |
| GET    | /api/auth/users       | Admin   | List all users    |

### Announcements
| Method | Endpoint                    | Access  | Description             |
|--------|-----------------------------|---------|-------------------------|
| GET    | /api/announcements          | Public  | Get all (paginated)     |
| GET    | /api/announcements/:id      | Public  | Get single              |
| POST   | /api/announcements          | Admin   | Create (multipart/form) |
| PUT    | /api/announcements/:id      | Admin   | Update                  |
| DELETE | /api/announcements/:id      | Admin   | Delete                  |

### Notices
| Method | Endpoint            | Access  | Description      |
|--------|---------------------|---------|------------------|
| GET    | /api/notices        | Public  | Get all          |
| POST   | /api/notices        | Admin   | Create           |
| PUT    | /api/notices/:id    | Admin   | Update           |
| DELETE | /api/notices/:id    | Admin   | Delete           |

### Downloads
| Method | Endpoint                  | Access  | Description   |
|--------|---------------------------|---------|---------------|
| GET    | /api/downloads            | Public  | Get all       |
| GET    | /api/downloads/stats      | Admin   | Dashboard stats|
| POST   | /api/downloads/upload     | Admin   | Upload PDF    |
| DELETE | /api/downloads/:id        | Admin   | Delete file   |

---

## Register your first admin

Use Postman / curl:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin User","email":"admin@college.edu","password":"admin123","role":"admin"}'
```

Then log in at http://localhost:5173/login

---

## Production Build

### Frontend

```bash
cd frontend
npm run build
```

Serve the `dist/` folder via Nginx or a CDN.

### Backend

Set `NODE_ENV=production` and use PM2:

```bash
npm install -g pm2
cd backend
pm2 start server.js --name "notice-board-api"
```

### Nginx config (example)

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location /api { proxy_pass http://localhost:5000; }
    location /uploads { proxy_pass http://localhost:5000; }

    location / {
        root /var/www/college-notice-board/frontend/dist;
        try_files $uri $uri/ /index.html;
    }
}
```

---

## Features

- 🏠 Home page with hero slider, quick links, latest content
- 📢 Announcements with image upload, categories, pagination, search
- 📋 Notices with department filter, priority levels, pagination, search
- 📥 Download center — PDF upload, category filter, file size display
- 🔐 JWT authentication with protected admin routes
- 🌙 Dark mode toggle
- 📱 Fully responsive (mobile-first)
- 🔔 Toast notifications on all actions
- ⚡ Admin dashboard with stats, recent activity, quick actions
