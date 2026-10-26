package com.devday.backend.repositories;

import com.devday.backend.models.BrainDump;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BrainDumpRepository extends JpaRepository<BrainDump, Long> {
    List<BrainDump> findAllByOrderByCreatedAtDesc();
}
