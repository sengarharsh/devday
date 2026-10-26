package com.devday.backend.services;

import com.devday.backend.models.BrainDump;
import com.devday.backend.repositories.BrainDumpRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class BrainDumpService {

    private final BrainDumpRepository brainDumpRepository;

    public BrainDumpService(BrainDumpRepository brainDumpRepository) {
        this.brainDumpRepository = brainDumpRepository;
    }

    public BrainDump createBrainDump(BrainDump brainDump) {
        return brainDumpRepository.save(brainDump);
    }

    public List<BrainDump> getAllBrainDumps() {
        return brainDumpRepository.findAllByOrderByCreatedAtDesc();
    }

    public void deleteBrainDump(Long id) {
        if (!brainDumpRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Brain dump not found with id: " + id);
        }
        brainDumpRepository.deleteById(id);
    }
}
