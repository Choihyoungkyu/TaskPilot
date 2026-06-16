package com.taskpilot.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_preferences", schema = "taskpilot")
public class UserPreference {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    @Column(name = "preferred_difficulty")
    private String preferredDifficulty;

    @Column(name = "timezone")
    private String timezone = "Asia/Seoul";

    @Column(name = "alert_enabled")
    private Boolean alertEnabled = true;

    @Column(name = "alert_lead_time_easy")
    private Integer alertLeadTimeEasy = 1;

    @Column(name = "alert_lead_time_medium")
    private Integer alertLeadTimeMedium = 2;

    @Column(name = "alert_lead_time_hard")
    private Integer alertLeadTimeHard = 3;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public UserPreference() {}

    public UserPreference(Long userId) {
        this.userId = userId;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getPreferredDifficulty() { return preferredDifficulty; }
    public void setPreferredDifficulty(String preferredDifficulty) { this.preferredDifficulty = preferredDifficulty; }

    public String getTimezone() { return timezone; }
    public void setTimezone(String timezone) { this.timezone = timezone; }

    public Boolean getAlertEnabled() { return alertEnabled; }
    public void setAlertEnabled(Boolean alertEnabled) { this.alertEnabled = alertEnabled; }

    public Integer getAlertLeadTimeEasy() { return alertLeadTimeEasy; }
    public void setAlertLeadTimeEasy(Integer alertLeadTimeEasy) { this.alertLeadTimeEasy = alertLeadTimeEasy; }

    public Integer getAlertLeadTimeMedium() { return alertLeadTimeMedium; }
    public void setAlertLeadTimeMedium(Integer alertLeadTimeMedium) { this.alertLeadTimeMedium = alertLeadTimeMedium; }

    public Integer getAlertLeadTimeHard() { return alertLeadTimeHard; }
    public void setAlertLeadTimeHard(Integer alertLeadTimeHard) { this.alertLeadTimeHard = alertLeadTimeHard; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
