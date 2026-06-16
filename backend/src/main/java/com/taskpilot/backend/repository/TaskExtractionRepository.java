package com.taskpilot.backend.repository;

import com.taskpilot.backend.entity.TaskExtraction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskExtractionRepository extends JpaRepository<TaskExtraction, Long> {
    List<TaskExtraction> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<TaskExtraction> findByTaskIdIsNull(int limit);
}
