package com.devday.backend.services;

import com.devday.backend.models.DSA;
import com.devday.backend.repositories.DSARepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class DSAService {

    private final DSARepository dsaRepository;

    public DSAService(DSARepository dsaRepository) {
        this.dsaRepository = dsaRepository;
    }

    public DSA saveQuestion(DSA question) {
        return dsaRepository.save(question);
    }

    public List<DSA> getAllQuestions() {
        return dsaRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<DSA> getBookmarkedQuestions() {
        return dsaRepository.findByBookmarkedTrueOrderByCreatedAtDesc();
    }

    public List<DSA> getSolvedQuestions() {
        return dsaRepository.findByCompletedTrueOrderByCreatedAtDesc();
    }

    public Optional<DSA> getQuestionById(Long id) {
        return dsaRepository.findById(id);
    }

    public DSA updateQuestionStatus(Long id, Map<String, Boolean> updates) {
        DSA question = dsaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Question not found with id: " + id));

        if (updates.containsKey("completed")) {
            question.setCompleted(Boolean.TRUE.equals(updates.get("completed")));
        }
        if (updates.containsKey("bookmarked")) {
            question.setBookmarked(Boolean.TRUE.equals(updates.get("bookmarked")));
        }

        return dsaRepository.save(question);
    }

    public void deleteQuestion(Long id) {
        if (!dsaRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Question not found with id: " + id);
        }
        dsaRepository.deleteById(id);
    }
}
