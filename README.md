# D&D HobbyHub

A streamlined, community‑driven platform for Dungeons & Dragons players to share posts, track campaigns, and collaborate with other adventurers. Built for speed, clarity, and ease of use.

Live Site: https://dndhobbyhub.vercel.app/

---

## 📸 Demo

### CodePath GIF  
![CodePath Demo](./2026-05-03%2017-41-37.gif)

### Canvas GIF  
![Canvas Demo](./2026-05-03%2017-42-09.gif)

---

## ✨ Features

### 📝 Post Creation  
- Create posts with titles, content, and optional images  
- Auto‑attaches your username, class, and DM status  
- Instant feed refresh after posting  

### 📚 Post Feed  
- Displays all posts in a clean, scrollable layout  
- Sort by **Newest** or **Top Upvoted**  
- Search posts by title  
- Live upvote counts powered by a SQL view  

### 👍 Upvotes  
- One‑click upvoting  
- Prevents duplicate upvotes per user  
- Real‑time count updates on Post Page and Feed  

### 💬 Comments  
- Comment on any post  
- Username auto‑attached  
- Clean, threaded layout  

### 🔐 Authentication  
- Email/password signup  
- Google OAuth login  
- Automatic profile creation with RLS‑safe policies  

### 🧙 Profile System  
- Each user has:  
  - Username  
  - Class (Wizard, Fighter, etc.)  
  - DM status  
- Profiles protected by row‑level security  

### 🗺️ Tech Stack  
- **React + Vite** frontend  
- **Supabase** backend (Auth, Database, RLS, Storage)  
- **PostgreSQL** with views + policies  
- **Vercel** deployment  

---

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone <your-repo-url>
cd dnd-hobbyhub
