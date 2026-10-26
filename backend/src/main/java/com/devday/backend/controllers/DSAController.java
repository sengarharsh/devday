package com.devday.backend.controllers;

import com.devday.backend.models.DSA;
import com.devday.backend.services.DSAService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping({"/api/dsa"})
@CrossOrigin(origins = "*")
public class DSAController {

    private final DSAService dsaService;

    public DSAController(DSAService dsaService) {
        this.dsaService = dsaService;
    }

    @PostMapping
    public ResponseEntity<DSA> saveQuestion(@RequestBody DSA question) {
        return ResponseEntity.status(HttpStatus.CREATED).body(dsaService.saveQuestion(question));
    }

    @GetMapping
    public ResponseEntity<List<DSA>> getAllQuestions() {
        return ResponseEntity.ok(dsaService.getAllQuestions());
    }

    @GetMapping("/bookmarked")
    public ResponseEntity<List<DSA>> getBookmarkedQuestions() {
        return ResponseEntity.ok(dsaService.getBookmarkedQuestions());
    }

    @GetMapping("/solved")
    public ResponseEntity<List<DSA>> getSolvedQuestions() {
        return ResponseEntity.ok(dsaService.getSolvedQuestions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DSA> getQuestionById(@PathVariable Long id) {
        return dsaService.getQuestionById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}")
    public ResponseEntity<DSA> updateQuestionStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> updates
    ) {
        DSA updated = dsaService.updateQuestionStatus(id, updates);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Long id) {
        dsaService.deleteQuestion(id);
        return ResponseEntity.noContent().build();
    }
}
