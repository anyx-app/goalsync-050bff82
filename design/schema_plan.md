# Schema Plan - GoalSync

## Overview
GoalSync requires a schema that handles user hierarchy (Managers/Employees), goal tracking, performance review cycles, and 360-degree feedback.

## Tables

### 1. `profiles`
Extends Supabase `auth.users`. Stores user metadata and role information.
- `id` (uuid, PK, FK -> auth.users.id)
- `email` (text)
- `full_name` (text)
- `avatar_url` (text, nullable)
- `role` (text, check: 'admin', 'manager', 'employee')
- `department` (text, nullable)
- `job_title` (text, nullable)
- `manager_id` (uuid, FK -> profiles.id, nullable) - Self-referencing FK for hierarchy
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

### 2. `goals`
Tracks individual or team goals.
- `id` (uuid, PK)
- `user_id` (uuid, FK -> profiles.id) - The owner of the goal
- `reviewer_id` (uuid, FK -> profiles.id, nullable) - Who reviews this goal (usually manager)
- `title` (text)
- `description` (text)
- `status` (text, check: 'draft', 'in_progress', 'completed', 'blocked', 'cancelled')
- `progress` (integer, default 0) - 0 to 100
- `due_date` (date)
- `priority` (text, check: 'low', 'medium', 'high')
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

### 3. `review_cycles`
Defines a period for performance reviews (e.g., "Q1 2024 Performance Review").
- `id` (uuid, PK)
- `title` (text)
- `start_date` (date)
- `end_date` (date)
- `status` (text, check: 'upcoming', 'active', 'completed', 'archived')
- `created_by` (uuid, FK -> profiles.id)
- `created_at` (timestamptz)

### 4. `reviews`
Specific review instances linking a subject (employee) to a cycle.
- `id` (uuid, PK)
- `cycle_id` (uuid, FK -> review_cycles.id)
- `subject_id` (uuid, FK -> profiles.id) - The employee being reviewed
- `reviewer_id` (uuid, FK -> profiles.id) - The primary reviewer (manager)
- `status` (text, check: 'pending_self_review', 'pending_manager_review', 'completed', 'signed_off')
- `self_review_content` (jsonb, nullable) - Structured answers from employee
- `manager_review_content` (jsonb, nullable) - Structured answers from manager
- `final_score` (numeric, nullable)
- `submitted_at` (timestamptz)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

### 5. `feedback_360`
Peer feedback requests and responses.
- `id` (uuid, PK)
- `review_id` (uuid, FK -> reviews.id) - Links to the main review context
- `requester_id` (uuid, FK -> profiles.id) - Who requested the feedback (usually manager or subject)
- `provider_id` (uuid, FK -> profiles.id) - Who is giving the feedback (peer)
- `subject_id` (uuid, FK -> profiles.id) - Who the feedback is about
- `status` (text, check: 'pending', 'submitted', 'declined')
- `content` (jsonb, nullable) - The feedback answers
- `relationship` (text, check: 'peer', 'direct_report', 'manager', 'other')
- `requested_at` (timestamptz)
- `submitted_at` (timestamptz)

### 6. `analytics_snapshots` (Optional/Advanced)
Stores pre-calculated metrics for trend analysis to avoid expensive aggregations on the fly.
- `id` (uuid, PK)
- `user_id` (uuid, FK -> profiles.id)
- `snapshot_date` (date)
- `goals_completed_count` (integer)
- `average_rating` (numeric)
- `created_at` (timestamptz)

## Relationships
- `profiles` 1:N `goals` (owner)
- `profiles` 1:N `goals` (reviewer)
- `profiles` 1:N `profiles` (manager -> employees)
- `review_cycles` 1:N `reviews`
- `reviews` 1:N `feedback_360`

## Security (RLS) policies
- **profiles**: Public read (for org chart), update own only (except role/manager_id which is admin only).
- **goals**: Read own and direct reports'. Update own.
- **reviews**: 
    - Subject can read/write self_review.
    - Manager can read/write manager_review.
    - Admin can view all.
- **feedback_360**: 
    - Provider can read/write own until submitted.
    - Manager of subject can read.
    - Subject might NOT see raw feedback (depending on anonymity settings).

