-- =============================================================================
-- METTLE — PostgreSQL Database Testing & Verification Queries
-- Target Engine: Neon PostgreSQL
-- Location: backend/test_queries.sql
-- =============================================================================

-- =============================================================================
-- SECTION 1: FUNCTIONAL RPG WORKFLOW TESTS
-- =============================================================================

-- 1. User Creation
INSERT INTO users (id, email, password_hash, name)
VALUES ('11111111-1111-1111-1111-111111111111', 'hero@mettle.app', '$2b$10$hashedpass123', 'Hero Student');

-- 2. Character Creation
INSERT INTO characters (id, user_id, title, level, total_xp, gold, mettle_score)
VALUES ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Novice Scholar', 1, 0, 0, 0);

-- 3. Attribute Creation
INSERT INTO attributes (id, character_id, strength, intellect, discipline, creativity, consistency)
VALUES ('33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 10, 10, 10, 10, 10);

-- 4. Quest Creation
INSERT INTO tasks (id, user_id, title, description, category, difficulty, xp_reward, gold_reward, attribute_type, due_date, status)
VALUES ('44444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'Complete Database Design', 'Design core PostgreSQL schema', 'academics', 'hard', 100, 25, 'intellect', NOW() + INTERVAL '1 day', 'pending');

-- Initial Streak Initialization
INSERT INTO streaks (user_id, current_streak, longest_streak, last_activity_date)
VALUES ('11111111-1111-1111-1111-111111111111', 0, 0, NULL);

-- 5. Quest Completion (Mark task completed & log history)
UPDATE tasks 
SET status = 'completed' 
WHERE id = '44444444-4444-4444-4444-444444444444' AND status = 'pending';

INSERT INTO task_completions (user_id, task_id, task_title, xp_earned, gold_earned, attribute_gained, attribute_points, mettle_score_earned)
VALUES ('11111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444', 'Complete Database Design', 100, 25, 'intellect', 1, 15);

-- 6. XP & Level Update
UPDATE characters 
SET total_xp = total_xp + 100, level = 2 
WHERE user_id = '11111111-1111-1111-1111-111111111111';

-- 7. Gold Update
UPDATE characters 
SET gold = gold + 25 
WHERE user_id = '11111111-1111-1111-1111-111111111111';

-- 8. Mettle Score Update
UPDATE characters 
SET mettle_score = mettle_score + 15 
WHERE user_id = '11111111-1111-1111-1111-111111111111';

-- 9. Streak Update
UPDATE streaks 
SET current_streak = current_streak + 1, 
    longest_streak = GREATEST(longest_streak, current_streak + 1), 
    last_activity_date = CURRENT_DATE 
WHERE user_id = '11111111-1111-1111-1111-111111111111';

-- 10. Fetch Complete User RPG Data
SELECT 
    u.id AS user_id,
    u.name,
    u.email,
    c.title,
    c.level,
    c.total_xp,
    c.gold,
    c.mettle_score,
    a.strength,
    a.intellect,
    a.discipline,
    a.creativity,
    a.consistency,
    s.current_streak,
    s.longest_streak,
    (SELECT COUNT(*) FROM task_completions tc WHERE tc.user_id = u.id) AS total_tasks_completed
FROM users u
JOIN characters c ON c.user_id = u.id
JOIN attributes a ON a.character_id = c.id
JOIN streaks s ON s.user_id = u.id
WHERE u.id = '11111111-1111-1111-1111-111111111111';


-- =============================================================================
-- SECTION 2: CONSTRAINT & SECURITY TESTS
-- =============================================================================

-- Constraint Test A: Duplicate Email (Case-Insensitive)
INSERT INTO users (email, password_hash, name)
VALUES ('HERO@METTLE.APP', '$2b$10$hashedpass456', 'Duplicate User');

-- Constraint Test B: Invalid XP / Gold Values (Negative CHECK Violation)
UPDATE characters 
SET gold = -50 
WHERE user_id = '11111111-1111-1111-1111-111111111111';

-- Constraint Test C: Invalid Foreign Key
INSERT INTO tasks (user_id, title) 
VALUES ('99999999-9999-9999-9999-999999999999', 'Orphan Task');

-- Security Test D: Accessing Another User's Task/Data (Tenant Isolation Check)
-- Setup User 2
INSERT INTO users (id, email, password_hash, name)
VALUES ('55555555-5555-5555-5555-555555555555', 'villain@mettle.app', '$2b$10$hashedpass789', 'Other User');

-- Query simulating User 2 trying to read User 1's tasks
SELECT * FROM tasks 
WHERE id = '44444444-4444-4444-4444-444444444444' 
  AND user_id = '55555555-5555-5555-5555-555555555555';

-- Constraint Test E: Duplicate Quest Completion (Preventing re-completing an already completed task)
UPDATE tasks 
SET status = 'completed' 
WHERE id = '44444444-4444-4444-4444-444444444444' 
  AND status = 'pending';
