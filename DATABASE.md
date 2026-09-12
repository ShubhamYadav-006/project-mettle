# 🗄️ METTLE — Database Specification & Schema Architecture

> **Database Engine:** PostgreSQL (Neon Serverless PostgreSQL)  
> **Backend Driver:** `pg` (Node Postgres Connection Pool)  
> **Authority:** Backend is the sole source of truth; all progression state is strictly verified and persisted.

---

## 1. Relational Entity Architecture

```text
┌─────────────────┐       1 : 1       ┌──────────────────┐       1 : 1       ┌────────────────────┐
│      users      ├──────────────────►│    characters    ├──────────────────►│     attributes     │
└────────┬────────┘                   └──────────────────┘                   └────────────────────┘
         │
         │ 1 : 1                      1 : N                                  1 : N
         ├──────────────────────────► tasks ────────────────────────────────► activity_logs
         │
         │ 1 : 1                      1 : N                                  1 : N
         ├──────────────────────────► streaks ──────────────────────────────► inventory
         │
         │ 1 : N
         └──────────────────────────► user_badges
```

---

## 2. Core Tables Specification

### 2.1 `users`
Stores user authentication profiles, Google OAuth mappings, and avatars.
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  username VARCHAR(50) UNIQUE,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  google_id VARCHAR(255) UNIQUE,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 2.2 `characters`
Stores RPG progression stats, level, cumulative XP, and gold treasury.
```sql
CREATE TABLE characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(100) DEFAULT 'Novice Scholar',
  level INT DEFAULT 1,
  total_xp INT DEFAULT 0,
  gold INT DEFAULT 0,
  mettle_score INT DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 2.3 `attributes`
Stores character stat points across 5 core life pillars.
```sql
CREATE TABLE attributes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID NOT NULL UNIQUE REFERENCES characters(id) ON DELETE CASCADE,
  strength INT DEFAULT 10,
  intellect INT DEFAULT 10,
  discipline INT DEFAULT 10,
  creativity INT DEFAULT 10,
  consistency INT DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 2.4 `streaks`
Maintains consecutive active day tracking and streak freeze shields.
```sql
CREATE TABLE streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  freeze_count INT DEFAULT 0,
  last_activity_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 2.5 `tasks`
Stores user quests with difficulty tiers, rewards, and status.
```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  category VARCHAR(50) DEFAULT 'academics',
  difficulty VARCHAR(20) DEFAULT 'medium',
  xp_reward INT NOT NULL,
  gold_reward INT NOT NULL,
  attribute_type VARCHAR(50) DEFAULT 'intellect',
  due_date TIMESTAMP WITH TIME ZONE,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'completed', 'archived'
  is_recurring BOOLEAN DEFAULT FALSE,
  recurrence_pattern VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 2.6 `items` & `inventory`
Bazaar items catalog and user purchase records.
```sql
CREATE TABLE items (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  cost INT NOT NULL,
  category VARCHAR(50) DEFAULT 'consumable',
  icon VARCHAR(50),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_id VARCHAR(50) NOT NULL REFERENCES items(id),
  quantity INT DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 2.7 `badges` & `user_badges`
Milestone achievements and unlock records.
```sql
CREATE TABLE badges (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  requirement_type VARCHAR(50) NOT NULL,
  requirement_value INT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_id VARCHAR(50) NOT NULL REFERENCES badges(id),
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, badge_id)
);
```

### 2.8 `activity_logs`
Chronological audit events for quest completions, purchases, and level-ups.
```sql
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL,
  source_id UUID,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## 3. Transaction & Concurrency Guarantees

All quest completion and purchase operations execute inside PostgreSQL database transactions (`BEGIN` ... `COMMIT` / `ROLLBACK`):

1. **Row-Level Locking (`FOR UPDATE`)**: Prevents race conditions and double-completion exploits on parallel requests.
2. **Atomic Reward Distribution**: Character XP, Gold, Attribute stats, and Streak updates happen atomically in a single ACID transaction.
3. **Native SQL Date Evaluation**: Evaluates `s.last_activity_date = CURRENT_DATE` directly inside PostgreSQL engine, eliminating local timezone drift and duplicate same-day streak increments.