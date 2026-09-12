# METTLE — Database Specification

---

# 1. Database

- **Database:** PostgreSQL
- **Backend:** Node.js + Express.js
- **API:** REST
- Database is the source of truth.
- All important progression data must persist after refresh/login.

---

# 2. Core Tables

### Users

Stores authentication and basic user information.

- `id`
- `name`
- `email`
- `password_hash`
- `created_at`
- `updated_at`

### Characters

Stores the user's RPG character.

- `id`
- `user_id`
- `level`
- `total_xp`
- `gold`
- `mettle_score`
- `created_at`
- `updated_at`

### Tasks

Stores user quests/tasks.

- `id`
- `user_id`
- `title`
- `description`
- `category`
- `difficulty`
- `xp_reward`
- `gold_reward`
- `attribute_type`
- `due_date`
- `status`
- `created_at`
- `updated_at`

### Task Completions

Stores completion history.

- `id`
- `task_id`
- `user_id`
- `completed_at`
- `xp_earned`
- `gold_earned`

### Attributes

Stores character attributes.

- `id`
- `character_id`
- `strength`
- `intellect`
- `discipline`
- `creativity`
- `consistency`

---

# 3. Optional Tables

These can be added after the core system works.

### Items

- `id`
- `name`
- `description`
- `price`
- `type`

### Inventory

- `id`
- `user_id`
- `item_id`
- `quantity`

### Badges

- `id`
- `name`
- `description`
- `requirement`

### User Badges

- `id`
- `user_id`
- `badge_id`
- `earned_at`

### Transactions

- `id`
- `user_id`
- `amount`
- `type`
- `description`
- `created_at`

---

# 4. Relationships

- One User → One Character
- One User → Many Tasks
- One Task → Many Completions
- One Character → One Attributes record
- One User → Many Inventory Items
- One User → Many Badges
- One User → Many Transactions

---

# 5. Data Rules

- Every user-owned record must contain a user relationship.
- Users must never access another user's data.
- XP and rewards are calculated by the backend.
- Task completion must be validated by the backend.
- Duplicate/repeated completion must be prevented where applicable.
- Deleting a user should not leave invalid orphan records.

---

# 6. Progression Data

The database must store:

- Current XP
- Current level
- Mettle Score
- Gold
- Character attributes
- Streak information
- Quest completion history
- Rewards/inventory

---

# 7. Persistence Test

After completing a quest:

1. XP must update.
2. Gold must update.
3. Attributes must update.
4. Level must update if applicable.
5. Mettle Score must update.
6. Completion must be stored.
7. Refreshing the page must preserve the changes.

---

# 8. Security

- Never store plain-text passwords.
- Use password hashing.
- Validate all database inputs.
- Use parameterized queries/ORM protection.
- Never expose sensitive user information through APIs.
- Backend controls all progression calculations.

---

# 9. Source of Truth

```text
PostgreSQL → Backend → API → Frontend
```

The frontend displays game state but does not control the actual game state.