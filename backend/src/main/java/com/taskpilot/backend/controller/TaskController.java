package com.taskpilot.backend.controller;

import com.taskpilot.backend.dto.TaskCreateRequest;
import com.taskpilot.backend.dto.TaskResponse;
import com.taskpilot.backend.dto.TaskUpdateRequest;
import com.taskpilot.backend.entity.Task;
import com.taskpilot.backend.repository.TaskRepository;
import com.taskpilot.backend.util.PriorityCalculator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/tasks")
@CrossOrigin(origins = "*")
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    @PostMapping
    public ResponseEntity<TaskResponse> createTask(
            @Valid @RequestBody TaskCreateRequest request,
            @RequestHeader("X-User-Id") Long userId) {
        Task task = new Task(userId, request.getTitle(), request.getDueDate());
        task.setDescription(request.getDescription());
        task.setEstimatedDurationMinutes(request.getEstimatedDurationMinutes());
        task.setDifficulty(request.getDifficulty());
        task.setPriorityScore(PriorityCalculator.calculatePriorityScore(task));

        Task saved = taskRepository.save(task);
        return ResponseEntity.ok(new TaskResponse(saved));
    }

    @GetMapping
    public ResponseEntity<List<TaskResponse>> getTasks(
            @RequestHeader(value = "X-User-Id", required = false) Long userId,
            @RequestParam(defaultValue = "TODO") String status,
            jakarta.servlet.http.HttpServletRequest request) {
        Long authUserId = userId != null ? userId : (Long) request.getAttribute("userId");

        if (authUserId == null) {
            return ResponseEntity.badRequest().build();
        }

        final Long finalUserId = authUserId;
        List<Task> tasks = taskRepository.findByUserIdAndStatusOrderByPriorityScoreDesc(finalUserId, status);
        List<TaskResponse> responses = tasks.stream()
                .map(TaskResponse::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskResponse> getTask(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long userId) {
        return taskRepository.findById(id)
                .filter(task -> task.getUserId().equals(userId))
                .map(task -> ResponseEntity.ok(new TaskResponse(task)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}")
    public ResponseEntity<TaskResponse> updateTask(
            @PathVariable Long id,
            @RequestBody TaskUpdateRequest request,
            @RequestHeader("X-User-Id") Long userId) {
        return taskRepository.findById(id)
                .filter(task -> task.getUserId().equals(userId))
                .map(task -> {
                    if (request.getTitle() != null) task.setTitle(request.getTitle());
                    if (request.getDescription() != null) task.setDescription(request.getDescription());
                    if (request.getDueDate() != null) task.setDueDate(request.getDueDate());
                    if (request.getEstimatedDurationMinutes() != null) {
                        task.setEstimatedDurationMinutes(request.getEstimatedDurationMinutes());
                    }
                    if (request.getDifficulty() != null) task.setDifficulty(request.getDifficulty());
                    if (request.getStatus() != null) task.setStatus(request.getStatus());

                    task.setPriorityScore(PriorityCalculator.calculatePriorityScore(task));
                    task.setUpdatedAt(LocalDateTime.now());

                    Task updated = taskRepository.save(task);
                    return ResponseEntity.ok(new TaskResponse(updated));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long userId) {
        return taskRepository.findById(id)
                .filter(task -> task.getUserId().equals(userId))
                .map(task -> {
                    taskRepository.delete(task);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/weekly")
    public ResponseEntity<List<TaskResponse>> getWeeklyTasks(
            @RequestHeader("X-User-Id") Long userId) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime nextWeek = now.plusWeeks(1);

        List<Task> tasks = taskRepository.findByUserIdAndDueDateBetween(userId, now, nextWeek);
        tasks.sort((a, b) -> Float.compare(b.getPriorityScore(), a.getPriorityScore()));

        List<TaskResponse> responses = tasks.stream()
                .map(TaskResponse::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }
}
