# 📜 METTLE — Product Requirements Document (PRD)

> **Product:** Mettle  
> **Brand Identity:** Mettle  
> **Core Concept:** Life RPG & Gamified Habit Progression Platform  
> **Target Stack:** PostgreSQL (Neon) + Express.js + React 18 + Tailwind CSS + Vite  
> **Design Aesthetic:** Monochrome + Electric Lime (`#B5E34A`)  
> **Document Status:** Complete & Aligned with Production Implementation

---

## 1. Product Overview & Philosophy

**Mettle** converts real-world responsibilities and daily habits into a structured RPG character progression system.

### Core Product Philosophy
> **"Your discipline is not what you plan to do. It's what you repeatedly do."**

---

## 2. Core Feature Pillars

### 2.1 Character & Progression Engine
- **Non-Linear Leveling Formula**:
  $$\text{Required Cumulative XP for Level } N = \text{round}\left(250 \times (N - 1)^{1.5}\right)$$
- **Milestone RPG Titles**:
  - Level 1–2: *Novice Scholar*
  - Level 3–4: *Apprentice Scholar*
  - Level 5–6: *Disciplined Practitioner*
  - Level 7–9: *Adept Knight*
  - Level 10–14: *Elite Vanguard*
  - Level 15–19: *Master Paragon*
  - Level 20+: *Grandmaster of Mettle*
- **Level-Up Gold Bonus**: $+10\text{ Gold} \times \text{levels gained}$
- **Mettle Score**: Dynamic composite rating reflecting overall character maturity and habit consistency.

### 2.2 5-Axis Attribute System
Quests directly improve 5 core life attributes:
1. **Intellect** (Academic, study, problem solving)
2. **Discipline** (Routines, daily execution, overcoming resistance)
3. **Strength** (Physical exercise, fitness, health)
4. **Creativity** (Building, coding, writing, arts)
5. **Consistency** (Active habit streaks)

### 2.3 Quest & Task Management
- **Difficulty Tiers**:
  - `Trivial`: 15 XP, 5 Gold, 1 Stat Point
  - `Easy`: 30 XP, 10 Gold, 1 Stat Point
  - `Medium`: 60 XP, 20 Gold, 1 Stat Point
  - `Hard`: 120 XP, 45 Gold, 2 Stat Points
  - `Epic`: 250 XP, 100 Gold, 3 Stat Points
- **Starter Quests**: Automatically seeded for every new user upon registration.
- **Fast Creation Modal**: Rapid quest creation with keyboard shortcuts.

### 2.4 Habit Streaks & Streak Shields
- **Zero-Drift PostgreSQL Evaluation**: Verifies consecutive calendar activity directly in SQL without UTC timezone shifts.
- **Streak Freeze Shields**: Usable items purchased from Bazaar that protect streaks from breaking when a day is missed.

### 2.5 Reward Bazaar & Economy
- **Virtual Treasury**: Gold earned purely by completing verified quests.
- **Bazaar Items**:
  - Streak Freeze Shield (Protection from missed days)
  - Focus Elixir (XP multiplier)
  - Custom user milestones

### 2.6 Sound Synthesis & Visual Polish
- **Web Audio API**: Real-time synthesizer audio for quest completions (`playComplete`) and button clicks (`playClick`).
- **Confetti Celebration**: Celebratory particle effects on quest completion and level ups.
- **Unified Theming**: Seamless Light & Dark mode support via CSS Custom Properties.

---

## 3. User Experience & Navigation

- **Ultra-Minimalist Navbar**:
  ```text
  Mettle  │  Level 3 Shubham  │  🔥 1 day  │  🪙 40  │  ☾ / ☼  │  ⋮
  ```
- **Action-Oriented Dashboard**: Compact quest cards with single-click checkbox completion, inline difficulty badges, and live 5-axis attribute radar.
- **Responsive Navigation**: Mobile bottom bar navigation for fast handheld usage.

---

## 4. Security & Anti-Cheat Architecture

- **Backend Authority**: Frontend is purely a presentation layer; all XP, gold, level-up calculations, and inventory operations are evaluated on the backend.
- **ACID Transactions**: Row-level locking (`FOR UPDATE`) guarantees double completions and race conditions are strictly blocked.
- **Authentication**: Secure bcrypt password hashing + JWT tokens + optional Google OAuth 2.0.