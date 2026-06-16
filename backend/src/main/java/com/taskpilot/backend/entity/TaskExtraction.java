package com.taskpilot.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "task_extractions", schema = "taskpilot")
public class TaskExtraction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "raw_input", columnDefinition = "TEXT")
    private String rawInput;

    @Column(name = "extracted_title")
    private String extractedTitle;

    @Column(name = "extracted_due_date")
    private LocalDateTime extractedDueDate;

    @Column(name = "extracted_duration")
    private Integer extractedDuration;

    @Column(name = "extracted_difficulty")
    private String extractedDifficulty;

    @Column(name = "task_id")
    private Long taskId;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public TaskExtraction() {}

    public TaskExtraction(Long userId, String rawInput) {
        this.userId = userId;
        this.rawInput = rawInput;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getRawInput() { return rawInput; }
    public void setRawInput(String rawInput) { this.rawInput = rawInput; }

    public String getExtractedTitle() { return extractedTitle; }
    public void setExtractedTitle(String extractedTitle) { this.extractedTitle = extractedTitle; }

    public LocalDateTime getExtractedDueDate() { return extractedDueDate; }
    public void setExtractedDueDate(LocalDateTime extractedDueDate) { this.extractedDueDate = extractedDueDate; }

    public Integer getExtractedDuration() { return extractedDuration; }
    public void setExtractedDuration(Integer extractedDuration) { this.extractedDuration = extractedDuration; }

    public String getExtractedDifficulty() { return extractedDifficulty; }
    public void setExtractedDifficulty(String extractedDifficulty) { this.extractedDifficulty = extractedDifficulty; }

    public Long getTaskId() { return taskId; }
    public void setTaskId(Long taskId) { this.taskId = taskId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
