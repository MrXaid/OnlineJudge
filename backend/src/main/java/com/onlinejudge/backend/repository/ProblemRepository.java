package com.onlinejudge.backend.repository;

import com.onlinejudge.backend.model.Problem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProblemRepository extends JpaRepository<Problem, Long> {
    boolean existsByName(String name);
    List<Problem> findTop10ByOrderByCountACDesc();

    List<Problem> findByTagsInIgnoreCase(List<String> tags);

    List<Problem> findAllByOrderByCountACAsc();

    List<Problem> findAllByOrderByCountACDesc();

}
