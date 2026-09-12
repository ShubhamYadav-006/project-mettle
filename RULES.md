# METTLE — Hackathon Rules & Compliance

---

# 1. Hackathon Rules

- Follow all official Tech Zephyr 4.0 Web Hackathon rules.
- Project must be developed during the hackathon.
- No plagiarism or copied projects.
- No outsourcing or external development help.
- AI tools are allowed but must be disclosed.
- Third-party libraries, APIs, frameworks, templates, and boilerplates must be disclosed where required.

---

# 2. Project Requirements

Mettle must have:

- Secure user authentication
- User-specific data isolation
- PostgreSQL database
- Backend API
- Quest/Task CRUD
- Quest completion system
- XP system
- Non-linear leveling
- Character attributes
- Streaks
- Rewards/economy
- Responsive UI
- Accessible UI
- Persistent database storage

---

# 3. Security Rules

- Backend is the authority for game data.
- Never trust frontend values for:
  - XP
  - Gold
  - Level
  - Attributes
  - Streaks
  - Inventory
- Users can access only their own data.
- Authentication must be secure.
- JWT must use HTTP-only cookies.
- Validate and sanitize API inputs.

---

# 4. Database Rules

- PostgreSQL is the source of truth.
- Do not use localStorage as the main database.
- Important actions must persist after refresh/login.
- Maintain proper relational structure.
- Store historical completion/progression data where required.

---

# 5. Git Rules

- Maintain clean chronological commits.
- Minimum required chronological commits must be satisfied.
- Do not create fake commit history.
- Commits must begin after the officially announced hackathon start.
- GitHub repository must be public for submission.

---

# 6. UI/UX Rules

- Mettle must feel like a game, not a generic SaaS dashboard.
- Maintain one consistent visual theme.
- Use meaningful animations and micro-interactions.
- Avoid unnecessary UI complexity.
- Support mobile, tablet, and desktop.
- Support keyboard navigation.
- Use semantic HTML and accessible labels.

---

# 7. Submission Requirements

Final submission must include:

- Working project
- Public GitHub repository
- Clean README
- Setup instructions
- `.env.example`
- Live deployed URL
- Required demonstration video

---

# 8. Demo Video

Video must:

- Be under 100 MB.
- Be 90–180 seconds.
- Show signup/login.
- Show adding a quest.
- Show completing a quest.
- Show XP/progression or level-up.
- Refresh the application.
- Demonstrate that data persists in the database.

---

# 9. Disqualification Risks

Avoid:

- Broken deployment
- Private/inaccessible repository
- Fake data persistence
- localStorage-only implementation
- Missing backend
- Database failure
- Runtime/console crashes
- Copied projects
- Missing required video
- Restricted or invalid submission links
- Unethical or prohibited behavior

---

# 10. Development Priority

### P0 — Mandatory

Build and stabilize all official requirements first.

### P1 — Important

Add polish such as:

- Inventory
- Badges
- Statistics
- Advanced animations
- Loading states
- Optimistic UI

### P2 — Optional

Add creative WOW features only after P0 is completely stable.

---

# 11. Core Principle

> **Build a functional, secure, persistent, polished Life RPG first.**  
> **Fancy features must never compromise the mandatory requirements.**

---

# 12. Final Test

Before submission, verify:

```text
Signup → Login → Add Quest → Complete Quest → Earn XP → Level Up → Refresh → Data Persists
```