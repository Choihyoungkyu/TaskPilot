-- TaskPilot PostgreSQL Schema
-- Run this script to initialize the database

-- Create schema
CREATE SCHEMA IF NOT EXISTS taskpilot;
SET search_path TO taskpilot;

-- ============================================
-- Users Table
-- ============================================
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(100),
    password_hash VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- User Preferences (개인화 설정)
-- ============================================
CREATE TABLE user_preferences (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    preferred_difficulty VARCHAR(50), -- EASY, MEDIUM, HARD (선호 난이도)
    timezone VARCHAR(50) DEFAULT 'Asia/Seoul',
    alert_enabled BOOLEAN DEFAULT TRUE,
    alert_lead_time_easy INT DEFAULT 1, -- 하루 전 (1일)
    alert_lead_time_medium INT DEFAULT 2, -- 2일 전
    alert_lead_time_hard INT DEFAULT 3, -- 3일 전
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================
-- Tasks Table (일정/태스크)
-- ============================================
CREATE TABLE tasks (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date TIMESTAMP NOT NULL,
    estimated_duration_minutes INT, -- 예상 소요 시간 (분 단위)
    difficulty VARCHAR(50) DEFAULT 'MEDIUM', -- EASY, MEDIUM, HARD
    priority_score FLOAT DEFAULT 0, -- AI가 계산한 우선순위 점수 (0~100)
    status VARCHAR(50) DEFAULT 'TODO', -- TODO, IN_PROGRESS, COMPLETED
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_status (user_id, status),
    INDEX idx_user_due_date (user_id, due_date)
);

-- ============================================
-- Alerts Table (알림 로그)
-- ============================================
CREATE TABLE alerts (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    task_id BIGINT NOT NULL,
    alert_type VARCHAR(50) DEFAULT 'KAKAO', -- KAKAO, EMAIL, etc.
    sent_at TIMESTAMP,
    status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, SENT, FAILED
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    INDEX idx_user_sent_at (user_id, sent_at)
);

-- ============================================
-- Task Extractions (텍스트 분석 로그)
-- ============================================
CREATE TABLE task_extractions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    raw_input TEXT NOT NULL, -- 사용자가 입력한 원본 텍스트
    extracted_title VARCHAR(255),
    extracted_due_date TIMESTAMP,
    extracted_duration INT,
    extracted_difficulty VARCHAR(50),
    task_id BIGINT, -- 연결된 Task ID (null이면 미처리)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE SET NULL
);

-- ============================================
-- Indexes
-- ============================================
CREATE INDEX idx_tasks_user_priority ON tasks(user_id, priority_score DESC, status);
CREATE INDEX idx_alerts_pending ON alerts(status, created_at);
