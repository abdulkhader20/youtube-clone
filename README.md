# YouTube Clone — MERN Stack

A full-stack YouTube clone built with MongoDB, Express, React, and Node.js.

---

## Features

- **Home Page** — Video grid with filter buttons (6+ categories) and search by title
- **User Authentication** — Register, login, JWT-based auth, persistent sessions
- **Video Player** — Watch videos, like/dislike (toggle), full comment CRUD
- **Channel Page** — Create channel, upload/edit/delete videos
- **Search** — Search videos by title from the header
- **Responsive** — Works on mobile, tablet, and desktop

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, React Router v7, Axios, Vite |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (Mongoose) |
| Auth | JWT (JSON Web Tokens), bcryptjs |
| Styling | CSS (custom, responsive) |

---

## Project Structure

```
youtube/
├── backend/                  # Node.js + Express API
│   ├── controllers/          # Business logic
│   ├── models/               # Mongoose schemas
│   ├── routes/               # API routes
│   ├── middleware/           # JWT auth middleware
│   ├── server.js             # Entry point
│   └── .env                  # Environment variables
│
└── youtube clone/            # React frontend (Vite)
    └── src/
        ├── components/       # Header, Sidebar, VideoCard
        ├── context/          # AuthContext (global auth state)
        ├── pages/            # Home, Login, Register, VideoPlayer, Channel
        └── data/             # Sample data (fallback)
```

---

## Setup & Installation

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier)

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/youtube-clone.git
cd youtube-clone
```

### 2. Backend setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/youtube-clone?retryWrites=true&w=majority
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d
```

Start the backend:
```bash
npm run dev
```

### 3. Frontend setup
```bash
cd "youtube clone"
npm install
npm run dev
```

### 4. Open the app
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

---

## API Endpoints

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login and get JWT |
| GET | `/api/auth/me` | Get current user (protected) |

### Videos
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/videos` | Get all videos (search & filter) |
| GET | `/api/videos/:id` | Get single video |
| POST | `/api/videos` | Upload video (protected) |
| PUT | `/api/videos/:id` | Update video (protected) |
| DELETE | `/api/videos/:id` | Delete video (protected) |
| PUT | `/api/videos/:id/like` | Like/unlike video (protected) |
| PUT | `/api/videos/:id/dislike` | Dislike/undislike video (protected) |

### Channels
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/channels` | Create channel (protected) |
| GET | `/api/channels/my` | Get my channel (protected) |
| GET | `/api/channels/:id` | Get channel by ID |
| PUT | `/api/channels/:id` | Update channel (protected) |

### Comments
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/comments/:videoId` | Get comments for video |
| POST | `/api/comments/:videoId` | Add comment (protected) |
| PUT | `/api/comments/:id` | Edit comment (protected) |
| DELETE | `/api/comments/:id` | Delete comment (protected) |

---

## Usage

1. **Register** at `/register` with username, email, password
2. **Login** at `/login` — your name appears in the header
3. **Create a channel** at `/channel`
4. **Upload videos** from the channel page (paste a video URL)
5. **Browse videos** on the home page, filter by category
6. **Search** videos using the header search bar
7. **Watch videos** — like, dislike, add/edit/delete comments

---

## Notes

- Video URLs must be direct `.mp4` links or embeddable URLs
- Passwords are hashed with bcryptjs before storing
- JWT tokens expire after 7 days
- All protected routes require `Authorization: Bearer <token>` header
