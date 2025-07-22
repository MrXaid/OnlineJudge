package com.onlinejudge.backend.repository;

import com.onlinejudge.backend.model.Submission;
import com.onlinejudge.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SubmissionRepository extends JpaRepository<Submission, Long> {

    List<Submission> findByUser(User user);
    List<Submission> findByUserId(Long id);
    List<Submission> findByUserIdOrderByDateDesc(Long userId);
    List<Submission> findByProblemIdOrderByDateDesc(Long problemId);
    @Query("SELECT s FROM Submission s JOIN FETCH s.problem WHERE s.user.id = :userId")
    List<Submission> findAllWithProblemByUserId(@Param("userId") Long userId);
    List<Submission> findByProblemIdAndUserIdOrderByDateDesc(Long problemId, Long userId);

    List<Submission> findAllByOrderByDateDesc();
}
