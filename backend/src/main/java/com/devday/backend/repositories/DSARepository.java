package com.devday.backend.repositories;

import com.devday.backend.models.DSA;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DSARepository extends JpaRepository<DSA, Long> {
    List<DSA> findAllByOrderByCreatedAtDesc();
    List<DSA> findByBookmarkedTrueOrderByCreatedAtDesc();
    List<DSA> findByCompletedTrueOrderByCreatedAtDesc();
}
