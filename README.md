# Mettle

Mettle is a gamified personal productivity and life RPG platform that transforms daily habits, study routines, coding milestones, and real-world tasks into structured quests. By completing tasks, users earn experience points (XP) and Gold, advance through non-linear character levels, build five core attributes, preserve daily streaks, unlock milestone achievements, and redeem rewards from a built-in bazaar.

## Overview

Traditional productivity applications often feel transactional and uninspiring, leading to dropped habits and inconsistent execution. Mettle addresses this challenge by framing personal growth through RPG progression mechanics. 

Real-world effort directly powers in-game character development. Rather than relying on arbitrary checklists, every completed objective provides tangible feedback through level progression, attribute growth, economic incentives, and streak tracking. All progression rules, rewards, and character states are calculated authoritatively on the backend and persisted reliably in a PostgreSQL database.

## Core Features

- User Authentication: Secure registration and login using JWTs delivered via HTTP-only cookies and Authorization headers, with optional Google OAuth 2.0 integration.
- Quest and Task Management: Create, edit, filter, and complete quests categorized by Academics, Coding, Fitness, Routine, and Mindset.
- Difficulty-Based Reward Scaling: Five difficulty tiers (Trivial, Easy, Medium, Hard, Epic) with strictly scaled XP, Gold, and attribute point distributions.
- Non-Linear Level Progression: Mathematical progression curve where advancing to higher levels requires progressively greater cumulative XP.
- Dynamic Character Titles: Character titles that automatically update as users reach specific level milestones.
- Core Attribute Development: Five distinct attributes (Intellect, Discipline, Strength, Creativity, Consistency) that level up based on the category of completed quests.
- Streak Tracking and Protection: Automatic daily streak calculation with Streak Freeze Shield support to protect consistency across missed days.
- Reward Bazaar and Economy: An integrated shop where earned Gold can be spent on real-world rewards, utility items, and profile themes.
- Inventory Management: Real-time inventory tracking for purchased items and consumables.
- Achievement Badges: Automatic evaluation and unlock system for milestone badges based on quests completed, level reached, and active streaks.
- Activity Audit Trail: Comprehensive audit logging of quest completions, level milestones, item purchases, and streak adjustments.
- Welcome Email: Automated transactional welcome email dispatched via Resend upon successful new user registration.
- Level-Up Email: Backend-verified level-up notification email sent when a quest advances the user to a new level tier.
- Responsive Interface: Dark-mode interface designed with Electric Lime accents, optimized for desktop, tablet, and mobile viewports.

## Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- Lucide React (Iconography)
- Canvas Confetti (Level-up and completion effects)
- Axios (HTTP client with interceptors)

### Backend
- Node.js
- Express.js
- pg (node-postgres connection pool)
- bcryptjs (Password hashing)
- jsonwebtoken (JWT token management)
- cookie-parser (HTTP-only cookie processing)
- cors (Configurable cross-origin resource sharing)
- Resend (Transactional email delivery)

### Database
- PostgreSQL (Neon Serverless PostgreSQL with SSL)

## Application Architecture

```
User Client (Browser / Mobile)
        |
        v
React 18 Single Page Application (Vite + Tailwind CSS)
        |
        | [REST API over HTTPS with JWT / HTTP-Only Cookies]
        v
Node.js / Express Backend Server
        |
        +---> PostgreSQL Database (Neon)
        |     ├── users & characters
        |     ├── attributes & streaks
        |     ├── tasks & task_completions
        |     ├── rewards, inventory & transactions
        |     └── badges & activity_logs
        |
        +---> Resend API (Transactional Welcome & Level-Up Emails)
```

Game state calculations, reward allocations, level evaluations, and inventory transactions are executed exclusively on the backend inside PostgreSQL ACID transactions to prevent client tampering and guarantee data consistency.

## Progression System

### XP Requirement Formula
Level thresholds follow a non-linear exponential curve:

```
Required Cumulative XP for Level N = Math.round(250 * (N - 1)^1.5)
```

- Level 1: 0 XP
- Level 2: 250 XP
- Level 3: 707 XP
- Level 4: 1,299 XP
- Level 5: 2,000 XP
- Level 6: 2,795 XP
- Level 7: 3,674 XP
- Level 10: 6,750 XP

### Difficulty Reward Tiers

| Difficulty | XP Reward | Gold Reward | Attribute Points |
| :--- | :--- | :--- | :--- |
| Trivial | 15 XP | 5 Gold | +1 Point |
| Easy | 30 XP | 10 Gold | +1 Point |
| Medium | 60 XP | 20 Gold | +1 Point |
| Hard | 120 XP | 45 Gold | +2 Points |
| Epic | 250 XP | 100 Gold | +3 Points |

### Character Titles by Milestone

- Level 1+: Novice Scholar
- Level 3+: Apprentice Scholar
- Level 5+: Disciplined Practitioner
- Level 7+: Adept Knight
- Level 10+: Elite Vanguard
- Level 15+: Master Paragon
- Level 20+: Grandmaster of Mettle

## Attributes

Every character maintains five core attributes that start at a baseline of 10 points and increase through quest completion:

1. Intellect: Developed through Academics, reading, research, and problem-solving quests.
2. Discipline: Built by completing Routine, habit-forming, and adherence-focused quests.
3. Strength: Strengthened through Fitness, physical conditioning, and athletic quests.
4. Creativity: Enhanced by Coding, writing, design, and creative project quests.
5. Consistency: Reinforced through Mindset, daily streak maintenance, and continuous task completion.

## Rewards and Economy

Mettle includes a closed-loop virtual economy driven by effort:

- Earning Gold: Completing quests grants Gold scaled to the difficulty tier. Leveling up awards an additional bonus of 10 Gold per level gained.
- Reward Bazaar: Users can browse and purchase items from the catalog, including utility items (Streak Freeze Shield), lifestyle passes, and theme customizations.
- Transaction Ledger: Every Gold earning and expenditure is recorded in an immutable database audit log with running balances.
- Server-Side Validation: Purchase requests verify character balance with database row locks (`FOR UPDATE`) to prevent double-spending or negative balances.

## Email Functionality

Transactional email delivery is powered by Resend through dedicated backend services:

### Welcome Email
- Trigger: Dispatched immediately after a new user account is committed to PostgreSQL.
- Subject: `Welcome to Mettle — Your Journey Starts Here`
- Safeguards: Sent only once upon account registration. Never triggered on login, session refresh, or existing accounts.

### Level-Up Email
- Trigger: Dispatched when quest completion causes `New Level > Old Level`.
- Subject: `You Leveled Up! — Mettle Level {{newLevel}}`
- Safeguards: Calculated strictly by backend progression logic. If a single quest triggers a multi-level jump, exactly one consolidated email is sent. Quests completed without leveling up do not trigger emails.

### Failure Isolation
Email operations execute asynchronously after database transactions commit. If an email fails to deliver (e.g., network timeout, invalid key), the core user operation (signup, quest completion, level-up) remains completely successful.

## Security

- Authentication: Passwords hashed with bcrypt (salt factor 10). Session tokens signed via JWT.
- Dual-Mode Transport: JWTs delivered via Secure, HTTP-Only cookies with `sameSite` configuration and supported by `Authorization: Bearer` header fallbacks.
- Parameterized Queries: All database interactions utilize parameterized SQL queries through node-postgres to eliminate SQL injection vulnerabilities.
- Transaction Safety: Critical multi-table updates (registration, quest completion, item purchase) are isolated within PostgreSQL `BEGIN` / `COMMIT` / `ROLLBACK` blocks.
- Authorization and Data Isolation: Every query enforces strict `user_id` validation to guarantee tenant isolation.
- Secret Protection: Credentials, database strings, and API keys are managed exclusively via environment variables and excluded from source control.

## Project Structure

```
Mettle/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # PostgreSQL connection pool and query runner
│   │   ├── controllers/
│   │   │   ├── authController.js     # Auth, Google OAuth, and profile handlers
│   │   │   ├── rewardController.js   # Shop catalog and inventory handlers
│   │   │   ├── taskController.js     # Quest CRUD and completion handlers
│   │   │   └── userController.js     # User profile and stats handlers
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js     # JWT verification middleware
│   │   │   └── errorMiddleware.js    # Global 404 and error handling
│   │   ├── routes/
│   │   │   ├── authRoutes.js         # Authentication endpoints
│   │   │   ├── healthRoutes.js       # Health check route
│   │   │   ├── rewardRoutes.js       # Rewards and inventory endpoints
│   │   │   ├── taskRoutes.js         # Quests and tasks endpoints
│   │   │   └── userRoutes.js         # User profile endpoints
│   │   ├── services/
│   │   │   ├── activityService.js    # Activity audit log service
│   │   │   ├── authService.js        # User registration and login service
│   │   │   ├── badgeService.js       # Achievement evaluation service
│   │   │   ├── emailService.js       # Resend transactional email service
│   │   │   ├── rewardService.js      # Economy and inventory service
│   │   │   └── taskService.js        # Quest execution and leveling service
│   │   ├── utils/
│   │   │   ├── jwt.js                # Token generation and verification
│   │   │   ├── levelMath.js          # Non-linear progression equations
│   │   │   └── password.js           # bcrypt hashing utilities
│   │   └── app.js                    # Express application setup and CORS
│   ├── server.js                     # HTTP server entry point
│   ├── schema.sql                    # Production PostgreSQL DDL and seeds
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/               # Reusable UI components (Navbar, Modals, Cards)
│   │   ├── context/
│   │   │   └── AuthContext.jsx       # Global authentication state provider
│   │   ├── pages/
│   │   │   ├── AuthPage.jsx          # Login and registration interface
│   │   │   ├── CharacterPage.jsx     # Attribute radar and character sheet
│   │   │   ├── DashboardPage.jsx     # Primary HUD, daily overview, active quests
│   │   │   ├── LandingPage.jsx       # Public landing page with feature showcase
│   │   │   ├── ProfilePage.jsx       # Account settings and customization
│   │   │   ├── QuestsPage.jsx        # Full quest log and filter management
│   │   │   └── ShopPage.jsx          # Reward Bazaar and inventory interface
│   │   ├── utils/
│   │   │   └── api.js                # Axios instance with interceptors
│   │   ├── App.jsx                   # Router and main layout switch
│   │   ├── index.css                 # Global Tailwind and font styles
│   │   └── main.jsx                  # Application bootstrap
│   ├── index.html                    # HTML shell with Google Fonts
│   ├── vite.config.js                # Vite development and proxy configuration
│   ├── tailwind.config.js            # Tailwind typography and theme tokens
│   ├── package.json
│   └── .env.example
├── .gitignore
└── README.md
```

## Local Development

### Prerequisites

- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)
- PostgreSQL database (Local or Neon Serverless instance)
- Resend API key (Optional for local testing; emails are safely skipped if unconfigured)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ShubhamYadav-006/project-mettle.git
   cd project-mettle
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

### Environment Configuration

1. Configure Backend Environment:
   Create a `.env` file in the `backend/` directory based on `.env.example`:
   ```bash
   cd ../backend
   cp .env.example .env
   ```

   Fill in the required variables:
   ```env
   PORT=5000
   NODE_ENV=development
   DATABASE_URL=postgresql://user:password@host/database?sslmode=require
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRES_IN=7d
   CLIENT_URL=http://localhost:5173
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
   RESEND_API_KEY=your_resend_api_key
   EMAIL_FROM="Mettle <onboarding@resend.dev>"
   ```

2. Configure Frontend Environment:
   Create a `.env` file in the `frontend/` directory (optional in development due to Vite proxy):
   ```bash
   cd ../frontend
   cp .env.example .env
   ```

   ```env
   # Leave empty for local development to use the built-in Vite proxy
   VITE_API_URL=
   ```

### Database Initialization

Apply the PostgreSQL database schema and initial seed data:
```bash
cd ../backend
npm run migrate
```

### Running the Application

1. Start the Backend API Server:
   ```bash
   cd backend
   npm run dev
   ```
   The backend API will start on `http://localhost:5000`.

2. Start the Frontend Development Server:
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend application will start on `http://localhost:5173`.

## Verification and Testing

The repository includes automated test suites to validate database persistence, progression math, security boundaries, and email delivery:

- Full Integration and Persistence Suite:
  ```bash
  cd backend
  node src/test_full_integration.js
  ```
  Validates registration, quest creation, XP calculations, non-linear leveling, duplicate completion rejection, reward bazaar purchases, inventory updates, and session restoration.

- Transactional Email Suite:
  ```bash
  cd backend
  node src/test_full_email_suite.js
  ```
  Validates HTML/text template rendering, direct Resend API delivery, level-up transitions, multi-level jump consolidation, and graceful failure handling.

- Frontend Production Build:
  ```bash
  cd frontend
  npm run build
  ```
  Verifies that all JSX templates, CSS styles, and assets compile into optimized production bundles without errors.
