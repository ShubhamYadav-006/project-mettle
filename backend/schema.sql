-- =============================================================================
-- METTLE — Core PostgreSQL Database Schema (Final Production Version)
-- Target Engine: Neon PostgreSQL (PostgreSQL 13+)
-- Safe to execute repeatedly on fresh or existing databases.
-- Location: backend/schema.sql
-- =============================================================================

-- Clean up existing objects in reverse-dependency order (Idempotent Execution)
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS user_badges CASCADE;
DROP TABLE IF EXISTS badges CASCADE;
DROP TABLE IF EXISTS inventory CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS rewards CASCADE;
DROP TABLE IF EXISTS task_completions CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS attributes CASCADE;
DROP TABLE IF EXISTS characters CASCADE;
DROP TABLE IF EXISTS streaks CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------------------------
-- Helper Function: Automatic updated_at Timestamp Refresh
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- 1. TABLE: users
-- =============================================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_users_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

CREATE UNIQUE INDEX idx_users_email_lower ON users (LOWER(email));

CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


-- =============================================================================
-- 2. TABLE: characters
-- =============================================================================
CREATE TABLE characters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL DEFAULT 'Novice Scholar',
    level INT NOT NULL DEFAULT 1,
    total_xp BIGINT NOT NULL DEFAULT 0,
    gold INT NOT NULL DEFAULT 0,
    mettle_score INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_characters_level CHECK (level >= 1),
    CONSTRAINT chk_characters_total_xp CHECK (total_xp >= 0),
    CONSTRAINT chk_characters_gold CHECK (gold >= 0),
    CONSTRAINT chk_characters_mettle_score CHECK (mettle_score >= 0)
);

CREATE TRIGGER trg_characters_updated_at
BEFORE UPDATE ON characters
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


-- =============================================================================
-- 3. TABLE: attributes
-- =============================================================================
CREATE TABLE attributes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    character_id UUID NOT NULL UNIQUE REFERENCES characters(id) ON DELETE CASCADE,
    strength INT NOT NULL DEFAULT 10,
    intellect INT NOT NULL DEFAULT 10,
    discipline INT NOT NULL DEFAULT 10,
    creativity INT NOT NULL DEFAULT 10,
    consistency INT NOT NULL DEFAULT 10,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_attributes_strength CHECK (strength >= 0),
    CONSTRAINT chk_attributes_intellect CHECK (intellect >= 0),
    CONSTRAINT chk_attributes_discipline CHECK (discipline >= 0),
    CONSTRAINT chk_attributes_creativity CHECK (creativity >= 0),
    CONSTRAINT chk_attributes_consistency CHECK (consistency >= 0)
);

CREATE TRIGGER trg_attributes_updated_at
BEFORE UPDATE ON attributes
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


-- =============================================================================
-- 4. TABLE: tasks
-- =============================================================================
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL DEFAULT 'academics',
    difficulty VARCHAR(20) NOT NULL DEFAULT 'medium',
    xp_reward INT NOT NULL DEFAULT 50,
    gold_reward INT NOT NULL DEFAULT 10,
    attribute_type VARCHAR(20) NOT NULL DEFAULT 'intellect',
    due_date TIMESTAMPTZ,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    is_recurring BOOLEAN NOT NULL DEFAULT FALSE,
    recurrence_pattern VARCHAR(20),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_tasks_difficulty CHECK (difficulty IN ('trivial', 'easy', 'medium', 'hard', 'epic')),
    CONSTRAINT chk_tasks_status CHECK (status IN ('pending', 'completed', 'archived', 'failed')),
    CONSTRAINT chk_tasks_attribute_type CHECK (attribute_type IN ('strength', 'intellect', 'discipline', 'creativity', 'consistency')),
    CONSTRAINT chk_tasks_xp_reward CHECK (xp_reward >= 0),
    CONSTRAINT chk_tasks_gold_reward CHECK (gold_reward >= 0),
    CONSTRAINT chk_tasks_recurrence_pattern CHECK (
        (is_recurring IS FALSE AND recurrence_pattern IS NULL) OR
        (is_recurring IS TRUE AND recurrence_pattern IN ('daily', 'weekly', 'monthly'))
    )
);

CREATE TRIGGER trg_tasks_updated_at
BEFORE UPDATE ON tasks
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


-- =============================================================================
-- 5. TABLE: task_completions
-- =============================================================================
CREATE TABLE task_completions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
    task_title VARCHAR(255) NOT NULL,
    xp_earned INT NOT NULL,
    gold_earned INT NOT NULL,
    attribute_gained VARCHAR(20) NOT NULL,
    attribute_points INT NOT NULL DEFAULT 1,
    mettle_score_earned INT NOT NULL DEFAULT 0,
    completed_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    
    CONSTRAINT chk_completions_xp_earned CHECK (xp_earned >= 0),
    CONSTRAINT chk_completions_gold_earned CHECK (gold_earned >= 0),
    CONSTRAINT chk_completions_attribute_points CHECK (attribute_points >= 0),
    CONSTRAINT chk_completions_mettle_score_earned CHECK (mettle_score_earned >= 0),
    CONSTRAINT chk_completions_attribute_gained CHECK (attribute_gained IN ('strength', 'intellect', 'discipline', 'creativity', 'consistency'))
);


-- =============================================================================
-- 6. TABLE: streaks
-- =============================================================================
CREATE TABLE streaks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    current_streak INT NOT NULL DEFAULT 0,
    longest_streak INT NOT NULL DEFAULT 0,
    last_activity_date DATE,
    freeze_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_streaks_current CHECK (current_streak >= 0),
    CONSTRAINT chk_streaks_longest CHECK (longest_streak >= 0),
    CONSTRAINT chk_streaks_longest_gte_current CHECK (longest_streak >= current_streak),
    CONSTRAINT chk_streaks_freeze CHECK (freeze_count >= 0)
);

CREATE TRIGGER trg_streaks_updated_at
BEFORE UPDATE ON streaks
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


-- =============================================================================
-- 7. TABLE: rewards (Catalog Items)
-- =============================================================================
CREATE TABLE rewards (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    cost INT NOT NULL CHECK (cost >= 0),
    category VARCHAR(50) NOT NULL DEFAULT 'real-life',
    icon VARCHAR(50) NOT NULL DEFAULT 'ShoppingBag',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- =============================================================================
-- 8. TABLE: transactions (Wallet Currency Audit Log)
-- =============================================================================
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount INT NOT NULL, -- Positive for earn, negative for spend
    balance_after INT NOT NULL CHECK (balance_after >= 0),
    type VARCHAR(50) NOT NULL, -- 'quest_reward', 'shop_purchase', 'level_bonus'
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- =============================================================================
-- 9. TABLE: inventory (User Owned Items & Theme Unlocks)
-- =============================================================================
CREATE TABLE inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reward_id VARCHAR(50) NOT NULL REFERENCES rewards(id) ON DELETE CASCADE,
    quantity INT NOT NULL DEFAULT 1 CHECK (quantity >= 0),
    is_equipped BOOLEAN NOT NULL DEFAULT FALSE,
    purchased_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(user_id, reward_id)
);


-- =============================================================================
-- 10. TABLE: badges (Achievement Definitions)
-- =============================================================================
CREATE TABLE badges (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'progression',
    icon VARCHAR(50) NOT NULL DEFAULT 'Award',
    requirement_type VARCHAR(50) NOT NULL, -- 'quests_completed', 'level_reached', 'streak_days'
    requirement_value INT NOT NULL CHECK (requirement_value > 0)
);


-- =============================================================================
-- 11. TABLE: user_badges (Unlocked Achievements)
-- =============================================================================
CREATE TABLE user_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    badge_id VARCHAR(50) NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(user_id, badge_id)
);


-- =============================================================================
-- 12. TABLE: activity_logs (Complete Audit Trail)
-- =============================================================================
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL, -- 'QUEST_COMPLETED', 'LEVEL_UP', 'REWARD_PURCHASED', 'STREAK_UPDATED', etc.
    source_id VARCHAR(100),
    amount INT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- =============================================================================
-- SEED BASELINE REWARDS & BADGES
-- =============================================================================
INSERT INTO rewards (id, name, description, cost, category, icon)
VALUES
('item_streak_freeze', 'Streak Freeze Shield', 'Protects your daily streak if you miss a day.', 100, 'utility', 'Shield'),
('item_gaming_pass', '30-Min Guilt-Free Gaming', 'Take a well-deserved break to play games.', 50, 'real-life', 'Gamepad2'),
('item_anime_pass', '1 Episode Anime Voucher', 'Watch an episode of your favorite show.', 40, 'real-life', 'Tv'),
('item_coffee_treat', 'Boba / Special Coffee Treat', 'Reward yourself with your favorite drink.', 120, 'real-life', 'Coffee'),
('item_cyberpunk_theme', 'Cyberpunk Neon Theme', 'Unlock a futuristic glowing neon app theme.', 200, 'theme', 'Palette'),
('item_midnight_theme', 'Midnight Obsidian Theme', 'Ultra-sleek dark stealth UI theme.', 300, 'theme', 'Moon')
ON CONFLICT (id) DO NOTHING;

INSERT INTO badges (id, name, description, category, icon, requirement_type, requirement_value)
VALUES
('badge_first_blood', 'First Blood', 'Completed your very first quest.', 'quests', 'Sparkles', 'quests_completed', 1),
('badge_novice_adventurer', 'Novice Adventurer', 'Completed 5 real-world quests.', 'quests', 'Award', 'quests_completed', 5),
('badge_quest_master', 'Quest Centurion', 'Completed 25 quests.', 'quests', 'Zap', 'quests_completed', 25),
('badge_level_5', 'Apprentice Scholar', 'Ascended to Level 5.', 'level', 'ShieldCheck', 'level_reached', 5),
('badge_level_10', 'Elite Vanguard', 'Ascended to Level 10.', 'level', 'Crown', 'level_reached', 10),
('badge_streak_3', 'Flame Ignited', 'Maintained a 3-day streak.', 'streaks', 'Flame', 'streak_days', 3),
('badge_streak_7', 'Iron Will', 'Maintained a 7-day uninterrupted streak.', 'streaks', 'Flame', 'streak_days', 7)
ON CONFLICT (id) DO NOTHING;


-- =============================================================================
-- NON-REDUNDANT INDEXES FOR PERFORMANCE & QUERY ISOLATION
-- =============================================================================

-- Tasks Query Optimization
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_user_status ON tasks(user_id, status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date) WHERE status = 'pending';

-- Task Completions History Optimization
CREATE INDEX idx_task_completions_user_id ON task_completions(user_id);
CREATE INDEX idx_task_completions_task_id ON task_completions(task_id);
CREATE INDEX idx_task_completions_user_completed ON task_completions(user_id, completed_at DESC);

-- Transactions & Inventory Optimization
CREATE INDEX idx_transactions_user_id ON transactions(user_id, created_at DESC);
CREATE INDEX idx_inventory_user_id ON inventory(user_id);
CREATE INDEX idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id, created_at DESC);
