package com.devday.backend.controllers;

import com.devday.backend.models.BrainDump;
import com.devday.backend.services.BrainDumpService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/brain-dumps")
@CrossOrigin(origins = "*")
public class BrainDumpController {

    private final BrainDumpService brainDumpService;

    public BrainDumpController(BrainDumpService brainDumpService) {
        this.brainDumpService = brainDumpService;
    }

    @PostMapping
    public ResponseEntity<BrainDump> createBrainDump(@RequestBody BrainDump brainDump) {
        return ResponseEntity.status(HttpStatus.CREATED).body(brainDumpService.createBrainDump(brainDump));
    }

    @GetMapping
    public ResponseEntity<List<BrainDump>> getAllBrainDumps() {
        return ResponseEntity.ok(brainDumpService.getAllBrainDumps());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBrainDump(@PathVariable Long id) {
        brainDumpService.deleteBrainDump(id);
        return ResponseEntity.noContent().build();
    }
}
