package com.devday.backend.controllers;

import com.devday.backend.models.Activity;
import com.devday.backend.repositories.ActivityRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activities")
@CrossOrigin(origins = "*")
public class ActivityController {

    private final ActivityRepository activityRepository;

    public ActivityController(ActivityRepository activityRepository) {
        this.activityRepository = activityRepository;
    }

    @PostMapping
    public ResponseEntity<Activity> createActivity(@RequestBody Activity activity) {
        return ResponseEntity.status(HttpStatus.CREATED).body(activityRepository.save(activity));
    }

    @GetMapping
    public ResponseEntity<List<Activity>> getAllActivities() {
        return ResponseEntity.ok(activityRepository.findAll());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteActivity(@PathVariable Long id) {
        if (!activityRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        activityRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
