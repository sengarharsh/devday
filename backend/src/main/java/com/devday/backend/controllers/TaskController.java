package com.devday.backend.controllers;

import com.devday.backend.models.Task;
import com.devday.backend.repositories.TaskRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskController {

    private final TaskRepository taskRepository;

    public TaskController(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks() {
        return ResponseEntity.ok(taskRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<Task> addTask(@RequestBody Task task) {
        if (task.isCompleted() && task.getCompletedAt() == null) {
            task.setCompletedAt(LocalDateTime.now());
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(taskRepository.save(task));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @RequestBody Task task) {
        return taskRepository.findById(id)
                .map(existing -> {
                    existing.setTitle(task.getTitle());
                    existing.setSkill(task.getSkill());
                    
                    if (task.isCompleted() && !existing.isCompleted()) {
                        existing.setCompletedAt(task.getCompletedAt() != null ? task.getCompletedAt() : LocalDateTime.now());
                    } else if (!task.isCompleted()) {
                        existing.setCompletedAt(null);
                    } else if (task.getCompletedAt() != null) {
                        existing.setCompletedAt(task.getCompletedAt());
                    }

                    existing.setCompleted(task.isCompleted());
                    existing.setDailyTask(task.isDailyTask());
                    return ResponseEntity.ok(taskRepository.save(existing));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        if (!taskRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        taskRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
