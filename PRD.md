# METTLE — Product Requirements Document

> **Product:** Mettle  
> **Hackathon:** Tech Zephyr 4.0 — Web Hackathon  
> **Round:** Round 1  
> **Problem Statement:** Life RPG  
> **Product Direction:** Student / Study Life RPG  
> **Primary Goal:** Help students build and demonstrate discipline through consistent real-world effort.  
> **Development Stack:** PERN + Tailwind CSS  
> **Document Status:** Master Product Specification

---

# 1. Product Overview

## 1.1 Product Name

**Mettle**

### Meaning

Mettle represents a person's inner strength, resilience, and ability to endure and grow through challenges.

For this product, Mettle represents the **strength a student builds through consistent action**.

The product does not simply measure what a student plans to do.

It measures what the student **actually does consistently**.

---

# 2. Product Vision

> **Mettle transforms a student's everyday responsibilities into an engaging RPG progression system where consistent effort builds visible discipline, character growth, and achievement.**

The application converts real-world student activities into game-like quests.

When students complete meaningful tasks, they receive:

- XP
- Character progression
- Attribute growth
- Virtual currency
- Streak progress
- Rewards

Over time, their consistent actions create a visible representation of their discipline.

---

# 3. Core Product Philosophy

## 3.1 Central Idea

> **Your discipline is not what you plan to do. It's what you repeatedly do.**

Mettle should make this philosophy visible through the product experience.

```text
Real-world effort
        ↓
Quest completion
        ↓
Immediate feedback
        ↓
XP + rewards
        ↓
Character progression
        ↓
Consistency / streak
        ↓
Visible growth
        ↓
Mettle
```

---

# 4. Problem We Are Solving

Traditional productivity tools such as:

- To-do lists
- Habit trackers
- Productivity dashboards

often feel like chores.

The real-world benefit of studying, exercising, reading, or learning may take weeks or months to become visible.

Games solve a similar psychological problem through:

- Immediate feedback
- Clear progression
- Rewards
- Levels
- Achievements
- Visible improvement

Mettle applies these principles to real-life student responsibilities.

The goal is to bridge the gap between:

> "I should do this."

and

> "I did this, and I can see myself progressing."

---

# 5. Target Users

## 5.1 Primary Users

Students who want to become more:

- Disciplined
- Consistent
- Productive
- Focused
- Academically active
- Physically active
- Goal-oriented

## 5.2 Typical Activities

Examples include:

- Studying
- Coding
- Completing assignments
- Reading
- Practicing a skill
- Preparing for examinations
- Exercising
- Personal development activities

These activities will be represented as quests.

---

# 6. Product Goals

Mettle should:

- Make student responsibilities feel engaging rather than boring.
- Give immediate feedback after completing meaningful work.
- Encourage consistency through streaks.
- Represent personal growth through character attributes.
- Reward students for completing tasks.
- Create a persistent record of progress.
- Make progression visually satisfying.
- Provide a strong RPG experience without sacrificing usability.
- Work reliably across devices.
- Demonstrate real full-stack functionality.

---

# 7. Non-Goals

For the initial hackathon version, Mettle is not intended to become:

- A complete social network
- A generic enterprise productivity platform
- A conventional SaaS dashboard
- A replacement for a college LMS
- A complex multiplayer RPG
- A fully fledged real-world financial/reward system

The focus is:

> **Student discipline through gamified real-world progression.**

---

# 8. Core Product Loop

The central product loop is:

```text
PLAN
  ↓
Create / receive a Quest
  ↓
ACT
  ↓
Complete the real-world task
  ↓
REWARD
  ↓
Earn XP + Currency
  ↓
PROGRESS
  ↓
Improve attributes / level
  ↓
CONSISTENCY
  ↓
Maintain streak
  ↓
GROW
  ↓
Build Mettle
```

This loop should be easy for a new user to understand.

---

# 9. Core Terminology

The application should use consistent terminology.

| Normal Concept | Mettle Concept |
| :--- | :--- |
| Task | Quest |
| Task completion | Quest Completion |
| Experience | XP |
| Character | Student Character |
| Points / currency | Gold / Virtual Currency |
| Statistics | Attributes |
| Habit consistency | Streak |
| Achievement | Badge |
| Rewards | Items / Rewards |
| Progress | Character Progression |
| Overall discipline | Mettle Score |

The exact terminology can be refined during the Design phase, but the product language must remain thematically cohesive.

---

# 10. Mettle Score

## 10.1 Purpose

The Mettle Score represents the student's demonstrated consistency and discipline.

It should not simply be a random score.

It should be derived from meaningful user activity.

Potential contributing factors include:

- Completed quests
- Consistency
- Streaks
- Difficulty of completed quests
- Long-term activity
- Discipline-related attribute progression

## 10.2 Principle

Mettle should be earned through behavior.

The exact mathematical formula will be finalized during the RPG and database design phases.

---

# 11. Mandatory Features

The following features are required by the official Life RPG problem statement.

## 11.1 User Authentication & Security

The application must provide:

- Signup
- Login
- Logout
- Secure password handling
- Session/authentication management
- Protected user data
- User-specific authorization

A user must only be able to see and modify their own:

- Tasks
- Character
- Progress
- Rewards
- Other private data

---

# 12. Task / Quest Management

Users must be able to:

- **Create**: Create a new quest.
- **Read**: View their quests.
- **Update**: Modify an existing quest.
- **Delete**: Delete a quest.
- **Complete**: Mark a quest as completed.

The system must persist all important task data in PostgreSQL.

---

# 13. RPG Progression Engine

The application must have a real progression system.

## 13.1 XP

Completing quests awards XP.

Example:

```text
Study for 1 hour
        ↓
     +50 XP
```

XP values will depend on the quest's characteristics.

## 13.2 Non-Linear Leveling

The level system must be non-linear.

Higher levels must require progressively more XP.

Example concept:

- Level 1 → relatively low XP
- Level 2 → higher XP
- Level 3 → higher again
- Level 4 → higher again
- ...

The exact formula will be designed during the RPG-engine phase.

---

# 14. Character Attributes

Tasks can contribute to specific character attributes.

Possible student-oriented attributes:

- Intellect
- Discipline
- Focus
- Knowledge
- Endurance

Example:

```text
Complete coding quest
        ↓
+ XP
+ Intellect

Complete daily study quest
        ↓
+ XP
+ Discipline
```

The final attribute list will be finalized during product and database design.

---

# 15. Streak System

Mettle must track consecutive days of activity.

Example:

```text
🔥 7 Day Streak

Mon  ✓
Tue  ✓
Wed  ✓
Thu  ✓
Fri  ✓
Sat  ✓
Sun  ✓
```

The streak must be based on persistent database activity.

It should not rely solely on frontend state or localStorage.

---

# 16. Rewards & Economy

Users must be able to earn virtual currency or points.

Example:

```text
Quest Completed
      ↓
   +50 XP
  +20 Gold
```

Users should be able to spend their earned currency on virtual rewards.

Possible rewards:

- Profile badges
- Themes
- Cosmetic items
- Character items

The economy must use actual persisted data.

---

# 17. Inventory

The application can maintain a user's collection of:

- Purchased items
- Unlocked rewards
- Badges
- Themes
- Other cosmetic/progression items

Inventory data must persist in PostgreSQL.

---

# 18. Required User Experience

The product should not feel like a normal productivity dashboard.

The official problem statement emphasizes a product that feels:

- **Alive**: The interface should react to user actions.
- **Tactile**: Important actions should feel satisfying.
- **Thematically Cohesive**: Visual design, terminology and interaction should follow one consistent theme.
- **Seamless**: The user should not feel slowed down by backend/network operations.

---

# 19. Feedback & Interaction

Important actions should provide immediate feedback.

For example:

```text
QUEST COMPLETE!

+100 XP
+30 GOLD
+5 DISCIPLINE
```

Potential interaction techniques:

- Micro-interactions
- XP bar animations
- Level-up animations
- Toast notifications
- Smooth transitions
- Particle effects where appropriate
- Optimistic UI updates
- Loading skeletons

Animations must support the experience rather than make the interface difficult to use.

---

# 20. Responsive & Accessible UI

The application must work across:

- Mobile
- Tablet
- Laptop
- Desktop

It must support:

- Keyboard navigation
  - Tab navigation
  - Enter
  - Space
- Semantic HTML
- Screen-reader-friendly structure
- Accessible controls
- Clear visual hierarchy

Accessibility is a functional requirement, not just a visual enhancement.

---

# 21. Core Screens

The initial product should contain the screens necessary to support the complete user journey.

## 21.1 Landing Page

**Purpose:**
- Explain Mettle
- Communicate the product concept
- Encourage signup/login

**Core message:**
- Build discipline through consistent action.

## 21.2 Signup

Allows a new student to create an account.

## 21.3 Login

Allows an existing student to access their account.

## 21.4 Main Dashboard

The primary Mettle experience.

Should communicate:
- Current level
- XP
- XP progress
- Mettle Score
- Streak
- Character attributes
- Active quests
- Recent progress
- Currency

## 21.5 Quest Page

Allows the user to:
- View quests
- Create quests
- Edit quests
- Delete quests
- Complete quests

## 21.6 Character / Profile

Shows the student's:
- Character
- Level
- XP
- Mettle Score
- Attributes
- Badges
- Progress

## 21.7 Rewards / Shop

Allows the user to:
- View available rewards
- View prices
- Purchase eligible items
- See owned items

## 21.8 Inventory

Displays owned:
- Items
- Themes
- Badges
- Other rewards

---

# 22. Primary User Journey

A first-time user should experience:

```text
Landing Page
      ↓
Signup
      ↓
Character / Initial Setup
      ↓
Dashboard
      ↓
Create Quest
      ↓
Complete Quest
      ↓
XP + Gold + Attribute Reward
      ↓
Progress Animation
      ↓
Continue Completing Quests
      ↓
Build Streak
      ↓
Level Up
      ↓
Earn / Buy Rewards
      ↓
Build Mettle
```

---

# 23. Data Persistence

Mettle must use PostgreSQL as the primary persistent data store.

Important information must survive:

```text
Page Refresh
      ↓
Logout
      ↓
Login Again
      ↓
Different Device
```

The application must not rely solely on localStorage for primary user data.

---

# 24. Backend Requirements

The backend will use:

- Node.js
- Express.js
- REST API
- PostgreSQL

Backend responsibilities include:

- Authentication
- Authorization
- User management
- Quest CRUD
- Quest completion
- XP calculations
- Level calculations
- Attribute updates
- Streak calculations
- Currency transactions
- Reward/inventory management
- Validation
- Error handling

---

# 25. Frontend Requirements

The frontend will use:

- React
- Tailwind CSS

Frontend responsibilities include:

- Rendering the application
- Authentication UI
- Dashboard
- Quest management
- Character progression
- Rewards
- Inventory
- Animations
- Loading states
- Error states
- Responsive layout
- Accessibility

---

# 26. API Principle

All important game-state changes must be validated by the backend.

For example:

```text
Frontend:
"Complete Quest #123"

        ↓

Backend:
Is the user authenticated?
Is Quest #123 owned by this user?
Is it already completed?
What XP should be awarded?
What attributes change?
What currency is earned?
Does the user level up?
Does the streak change?

        ↓

PostgreSQL

        ↓

Updated state returned
```

This prevents users from simply manipulating frontend values.

---

# 27. Security Principles

The backend must never blindly trust values sent by the frontend.

For example, the frontend should not be able to decide:

```text
xp = 999999
gold = 999999
level = 100
```

Instead, the server should calculate authoritative game-state changes.

The database should remain the source of truth.

---

# 28. Performance & Seamless Experience

The application should feel fast even though data is stored remotely.

We should use:

- Optimistic updates where safe
- Loading skeletons
- Efficient API calls
- Appropriate database queries
- Error recovery
- Smooth transitions

The user should not experience unnecessary waiting after simple actions.

---

# 29. Error & Edge Case Requirements

The application should gracefully handle:

- Empty quest submission
- Invalid data
- Unauthorized requests
- Expired authentication
- Already completed quests
- Insufficient currency
- Database errors
- API errors
- Network failures
- Failed requests
- Empty states
- Missing data

There should be no blank-screen crashes.

---

# 30. SEO

The application should include SEO-friendly foundations where applicable:

- Page titles
- Meta descriptions
- Semantic HTML
- Correct heading hierarchy
- Descriptive content
- Image alt text
- Clean URLs
- Optimized assets
- Good performance

---

# 31. MVP Definition

The MVP is not complete until all mandatory systems work together.

- **Authentication**
  - Signup
  - Login
  - Logout
  - Protected data
- **Quest System**
  - Create
  - Read
  - Update
  - Delete
  - Complete
- **RPG**
  - XP
  - Non-linear levels
  - Level progression
  - Attributes
- **Gamification**
  - Streaks
  - Currency
  - Rewards/economy
- **Persistence**
  - PostgreSQL
  - Refresh persistence
  - Login persistence
- **UX**
  - Responsive
  - Accessible
  - Functional
  - Thematically cohesive

---

# 32. Feature Priority

## P0 — Mandatory / Critical

These must work before optional features are considered.

- Authentication
- Database
- Quest CRUD
- Quest completion
- XP
- Non-linear leveling
- Attributes
- Streaks
- Rewards/Economy
- Responsive UI
- Accessibility
- Persistence
- Production deployment

## P1 — Important Polish

After P0 is stable:

- Inventory
- Badges
- Better statistics
- Advanced animations
- Improved empty states
- Optimistic UI
- Loading skeletons
- Enhanced dashboard

## P2 — Optional WOW Features

Only if all P0 requirements are complete and stable:

- Advanced gamification
- Special visual effects
- Additional progression mechanics
- Additional cosmetic systems
- Other creative enhancements

> **Note:** No P2 feature should endanger a P0 feature.

---

# 33. Product Success Criteria

Mettle is successful if a judge can:

- Create an account.
- Log in.
- Create a real quest.
- Complete the quest.
- Immediately see the reward.
- Receive XP.
- See progression toward the next level.
- Improve an attribute.
- Earn virtual currency.
- Build a streak.
- Level up.
- Access rewards.
- Refresh the page.
- Log back in.
- Still see the correct progress.
- Use the application on a mobile device.
- Navigate important controls using a keyboard.

---

# 34. Hackathon Demo Journey

The primary demo should communicate the entire product loop quickly:

```text
SIGN UP / LOGIN
      ↓
DASHBOARD
      ↓
CREATE QUEST
      ↓
COMPLETE QUEST
      ↓
+XP
+GOLD
+ATTRIBUTE
      ↓
LEVEL PROGRESS
      ↓
LEVEL UP
      ↓
STREAK
      ↓
REWARD / SHOP
      ↓
REFRESH
      ↓
DATA PERSISTS
```

This aligns with the required walkthrough demonstration from the official Problem Statement.

---

# 35. Demo Story

The demo should not feel like:

> "Here is our CRUD application."

It should feel like:

> "Here is a student who is trying to become more disciplined."

We should demonstrate a real progression story:

```text
Student starts
      ↓
Has quests to complete
      ↓
Completes meaningful work
      ↓
Receives immediate feedback
      ↓
Character grows
      ↓
Maintains consistency
      ↓
Builds Mettle
```

---

# 36. Product Differentiation

Mettle should differentiate itself from conventional productivity applications by making discipline the outcome of the system.

Most productivity tools emphasize:

- Tasks completed.

Mettle emphasizes:

- The person you're becoming through consistent effort.

The RPG mechanics are therefore not decoration.

They are the mechanism used to make discipline visible and rewarding.

---

# 37. AI & Development Disclosure

AI tools are allowed by the hackathon rules, but their use must be disclosed.

Mettle will maintain an accurate AI disclosure record throughout development.

Possible disclosed uses include:

- Architecture discussions
- Debugging assistance
- Code assistance
- Documentation assistance
- Code review
- Problem solving
- Development guidance

The final disclosure must accurately represent actual AI usage.

AI-generated/copied work must not be presented as undisclosed original work.

---

# 38. Technology Specification

- **Frontend**
  - React
  - Tailwind CSS
- **Backend**
  - Node.js
  - Express.js
  - REST API
- **Database**
  - PostgreSQL
- **Authentication**
  - JWT
  - HTTP-only Cookies
- **Deployment**
  - Frontend → Vercel
  - Backend → Render / Railway
  - Database → Hosted PostgreSQL

The final hosting provider may be selected during the deployment phase based on reliability and setup requirements.

---

# 39. Development Principle

Mettle will be developed in this order:

```text
PLAN
  ↓
FOUNDATION
  ↓
AUTHENTICATION
  ↓
DATABASE
  ↓
QUESTS
  ↓
RPG ENGINE
  ↓
GAMIFICATION
  ↓
UI/UX
  ↓
ACCESSIBILITY + SEO + EDGE CASES
  ↓
DEPLOYMENT
  ↓
SUBMISSION
```

The team will complete and stabilize required features before investing significant time in optional features.

---

# 40. Final Product Definition

Mettle is a student-focused Life RPG that turns real-world responsibilities into quests and transforms consistent effort into visible character growth. Through XP, non-linear progression, attributes, streaks, and rewards, Mettle helps students see the discipline they are building through the actions they take every day.

### Core Equation

```text
Consistent Action
        +
Meaningful Work
        +
Visible Progress
        =
Mettle
```

---

# 41. PRD Completion Definition

The PRD is considered implemented when the final application satisfies:

- [ ] Student-focused Life RPG experience
- [ ] Secure authentication
- [ ] PostgreSQL persistence
- [ ] Quest CRUD
- [ ] Quest completion
- [ ] XP system
- [ ] Non-linear leveling
- [ ] Character attributes
- [ ] Streak system
- [ ] Rewards/economy
- [ ] Responsive UI
- [ ] Keyboard accessibility
- [ ] Screen-reader-friendly structure
- [ ] Strong thematic identity
- [ ] Error handling
- [ ] Production deployment
- [ ] Required demo journey
- [ ] AI/third-party disclosure
- [ ] Hackathon submission requirements satisfied

### Source of Requirements

This PRD is based on the official Tech Zephyr 4.0 Web Hackathon Rulebook and the official Life RPG Problem Statement supplied for this project.

The official documents remain the source of truth for mandatory requirements, deliverables, judging expectations, accessibility requirements, persistence requirements, and disqualification rules.