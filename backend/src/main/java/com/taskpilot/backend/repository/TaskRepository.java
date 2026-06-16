package com.taskpilot.backend.repository;

import com.taskpilot.backend.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByUserIdAndStatus(Long userId, String status);

    List<Task> findByUserIdAndStatusOrderByPriorityScoreDesc(Long userId, String status);

    List<Task> findByUserIdAndDueDateBetween(Long userId, LocalDateTime start, LocalDateTime end);

    @Query("SELECT t FROM Task t WHERE t.userId = :userId AND t.status = :status ORDER BY t.priorityScore DESC")
    List<Task> findTasksByUserIdAndStatusSorted(@Param("userId") Long userId, @Param("status") String status);
}
