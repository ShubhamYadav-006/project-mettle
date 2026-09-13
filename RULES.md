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
- **JWT Authentication**: Token-based authentication verifying user identity via HTTP-only cookies with Authorization header fallback.
- **SQL Injection Prevention**: 100% of SQL queries utilize parameterized placeholders (`$1`, `$2`, etc.).
- **IDOR Protection**: All task mutations (`GET`, `PUT`, `DELETE`, `POST /complete`) strictly query with `WHERE id = $1 AND user_id = $2`.
- **CORS & Preflight**: Whitelist-based origin checking with explicit `204 No Content` OPTIONS preflight handling (disallowing wildcard `*` with credentials).
- **Error Boundaries**: Production React `<ErrorBoundary />` prevents unhandled UI crashes.

---

## 3. UI/UX & Design Guidelines

- **Monochrome + Electric Lime Theme**: Clean, high-contrast, distraction-free aesthetic (`#B5E34A`).
- **Wireframe Header**:
  ```text
  Mettle  │  Lvl 3 Shubham  │  🔥 1 day  │  🪙 40  │  ☾ / ☼  │  ⋮
  ```
- **High-Density Compact Cards**: Quick-action quest completion with zero unnecessary fluff.
- **Hardware-Accelerated Animations**: GPU-accelerated keyframes and `AnimatedNumber` tickers respecting `@media (prefers-reduced-motion)`.
- **Accessible & Responsive**: Fully responsive across mobile, tablet, and desktop with keyboard accessibility and high-contrast compliance (WCAG 2.1 AA).

---

## 4. AI Tooling & Disclosure Standard

- **Transparent AI Attribution**: Modern AI tools (ChatGPT and Google Antigravity) are acknowledged for research, technical guidance, and agentic pair-programming.
- **Human Review**: All database schemas, transactional integrity, security layers, business logic, and UI flows are verified and maintained by the engineering team.

---

## 5. Submission & Repository Checklist

- [x] Clean Git commit history on `main` branch.
- [x] Root `.gitignore` excluding `.env` files and `node_modules`.
- [x] Backend `.env.example` and frontend `.env.example` configuration templates.
- [x] Automated test suites covering RPG math, security, and full-stack persistence.
- [x] Verified zero-error production build (`npm run build`).
- [x] Code pushed to GitHub: `https://github.com/ShubhamYadav-006/project-mettle.git`.