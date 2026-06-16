package com.taskpilot.backend.util;

import com.taskpilot.backend.entity.Task;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

public class PriorityCalculator {

    public static float calculatePriorityScore(Task task) {
        if (task.getDueDate() == null) {
            return 0f;
        }

        LocalDateTime now = LocalDateTime.now();
        long daysUntilDeadline = ChronoUnit.DAYS.between(now, task.getDueDate());

        // Urgency: 마감일까지 남은 시간 (내일 마감이면 99점)
        float urgency = 100 - daysUntilDeadline;
        if (urgency < 0) {
            urgency = 100; // 마감이 지났으면 최고 우선순위
        }

        // Effort: 예상 소요시간 (2시간이면 +0.2점)
        float effort = 0;
        if (task.getEstimatedDurationMinutes() != null) {
            float hours = task.getEstimatedDurationMinutes() / 60f;
            effort = (hours / 10) * 10; // 최대 10점
        }

        // Complexity: 난이도 (HARD면 +3점)
        float complexity = 0;
        if (task.getDifficulty() != null) {
            switch (task.getDifficulty().toUpperCase()) {
                case "HARD":
                    complexity = 3f;
                    break;
                case "MEDIUM":
                    complexity = 1.5f;
                    break;
                case "EASY":
                    complexity = 0f;
                    break;
            }
        }

        return urgency + effort + complexity;
    }
}
