package com.taskpilot.backend.repository;

import com.taskpilot.backend.entity.Alert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlertRepository extends JpaRepository<Alert, Long> {
    List<Alert> findByUserIdAndStatus(Long userId, String status);

    List<Alert> findByTaskIdAndStatus(Long taskId, String status);

    List<Alert> findByUserIdAndAlertType(Long userId, String alertType);
}
