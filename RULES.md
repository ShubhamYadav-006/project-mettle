# ⚖️ METTLE — Architectural Rules, Compliance & Standards

> **Project:** Mettle  
> **Repository:** `https://github.com/ShubhamYadav-006/project-mettle.git`  
> **Stack:** PostgreSQL (Neon) + Express.js + React 18 + Tailwind CSS + Vite

---

## 1. Project Requirements & Architecture

Mettle strictly complies with the following architecture:
- **Backend Authority**: Backend is the sole authority for game logic, XP math, streak calculations, and currency balances. The frontend never dictates or submits computed reward values.
- **Database Persistence**: PostgreSQL is the single source of truth; all progression, stats, inventory, and streaks persist across sessions and page refreshes.
- **Data Isolation**: Strict user-level authorization ensures users can only access and modify their own quests and records.
- **Atomic Concurrency**: Quest completion and item purchases execute in database transactions with row-level locks to prevent double-spending or duplicate completions.

---

## 2. Security & Anti-Cheat Standards

- **Password Security**: Bcrypt with salted rounds; plain-text passwords are never stored.
- **JWT Authentication**: Token-based authentication verifying user identity on every protected endpoint.
- **SQL Injection Prevention**: 100% of SQL queries utilize parameterized placeholders (`$1`, `$2`, etc.).
- **IDOR Protection**: All task mutations (`GET`, `PUT`, `DELETE`, `POST /complete`) strictly query with `WHERE id = $1 AND user_id = $2`.

---

## 3. UI/UX & Design Guidelines

- **Monochrome + Electric Lime Theme**: Clean, high-contrast, distraction-free aesthetic (`#B5E34A`).
- **Wireframe Header**:
  ```text
  Mettle  │  Level 3 Shubham  │  🔥 1 day  │  🪙 40  │  ☾ / ☼  │  ⋮
  ```
- **High-Density Compact Cards**: Quick-action quest completion with zero unnecessary fluff.
- **Accessible & Responsive**: Fully responsive across mobile, tablet, and desktop with keyboard accessibility and high-contrast compliance (WCAG 2.1 AA).

---

## 4. Submission & Repository Checklist

- [x] Clean Git commit history on `main` branch.
- [x] Root `.gitignore` excluding `.env` files and `node_modules`.
- [x] Backend `.env.example` documentation with configuration placeholders.
- [x] Automated test suites covering RPG math, security, and full-stack persistence.
- [x] Code pushed to GitHub: `https://github.com/ShubhamYadav-006/project-mettle.git`.