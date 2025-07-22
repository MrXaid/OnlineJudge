package com.onlinejudge.backend.service;

import com.onlinejudge.backend.exception.APIException;
import com.onlinejudge.backend.model.Problem;
import com.onlinejudge.backend.model.Submission;
import com.onlinejudge.backend.model.User;
import com.onlinejudge.backend.payload.request.SubmissionRequest;
import com.onlinejudge.backend.payload.response.SubmissionResponseDTO;
import com.onlinejudge.backend.repository.ProblemRepository;
import com.onlinejudge.backend.repository.SubmissionRepository;
import com.onlinejudge.backend.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class SubmissionService {

    private final SubmissionRepository submissionRepository;
    private final ProblemRepository problemRepository;

    public Submission saveInitialSubmission(User user, SubmissionRequest req) {
        Problem problem = problemRepository.findById(req.getProblemId())
                .orElseThrow(() -> new ResourceNotFoundException("Problem", "id", req.getProblemId()));

        Submission submission = Submission.builder()
                .problemName(problem.getName())
                .code(req.getCode())
                .language(req.getLanguage())
                .verdict("Pending")
                .user(user)
                .problem(problem)
                .date(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date()))
                .build();

        return submissionRepository.save(submission);
    }

    public void updateVerdict(Submission submission, String verdict) {
        submission.setVerdict(verdict);
        submissionRepository.save(submission);
    }

    public List<Submission> getSubmissionsByUserId(Long userId) {
        return submissionRepository.findByUserIdOrderByDateDesc(userId);
    }
    public List<Submission> getSubmissionsByProblemId(Long problemId) {
        return submissionRepository.findByProblemIdOrderByDateDesc(problemId);
    }
    public SubmissionResponseDTO mapToDTO(Submission submission) {
        return new SubmissionResponseDTO(
                submission.getId(),
                submission.getProblemName(),
                submission.getLanguage(),
                submission.getVerdict(),
                submission.getDate(),
                submission.getCode(),
                submission.getUser().getUsername(),
                submission.getProblem().getId()
        );
    }
    public Map<String, Integer> getActivityMapForUser(Long userId) {
        List<Submission> submissions = submissionRepository.findByUserId(userId);

        Map<String, Integer> activityMap = new LinkedHashMap<>();

        // Step 1: Initialize all 365 days with 0 count
        LocalDate today = LocalDate.now();
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        for (int i = 0; i < 365; i++) {
            LocalDate date = today.minusDays(i);
            activityMap.put(date.format(dateFormatter), 0);
        }

        // Step 2: Parse submission dates and count
        for (Submission submission : submissions) {
            try {
                // Parse string to date
                String fullDateStr = submission.getDate(); // e.g. "2025-07-13 21:08:06"
                String dateOnlyStr = fullDateStr.substring(0, 10); // "2025-07-13"

                // Count only if within last 365 days
                if (activityMap.containsKey(dateOnlyStr)) {
                    activityMap.put(dateOnlyStr, activityMap.get(dateOnlyStr) + 1);
                }
            } catch (Exception e) {
                // In case date string is malformed
                throw new APIException("Failed to Fetch Activity Details: " + e.getMessage());
            }
        }

        return activityMap;
    }
    public Submission getSubmissionById(Long id) {
        return submissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Submission", "id", id));
    }
    public List<Submission> getSubmissionsByProblemIdAndUserId(Long problemId, Long userId) {
        return submissionRepository.findByProblemIdAndUserIdOrderByDateDesc(problemId, userId);
    }
    public List<Submission> getAllSubmissions() {
        return submissionRepository.findAllByOrderByDateDesc();
    }




}
