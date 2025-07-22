package com.onlinejudge.backend.controller;

import com.onlinejudge.backend.model.Submission;
import com.onlinejudge.backend.model.User;
import com.onlinejudge.backend.model.Problem;
import com.onlinejudge.backend.model.TestCase;
import com.onlinejudge.backend.payload.APIResponse;
import com.onlinejudge.backend.payload.request.SubmissionRequest;
import com.onlinejudge.backend.payload.response.SubmissionResponseDTO;
import com.onlinejudge.backend.repository.UserRepository;
import com.onlinejudge.backend.security.services.CustomUserDetails;
import com.onlinejudge.backend.service.SubmissionService;
import com.onlinejudge.backend.exception.ResourceNotFoundException;
import jakarta.annotation.security.RolesAllowed;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.io.*;
import java.nio.file.*;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/submissions")
@RequiredArgsConstructor
public class SubmissionController {

    private final SubmissionService submissionService;
    private final UserRepository userRepository;

    @PostMapping
    @RolesAllowed({"ROLE_USER", "ROLE_ADMIN"})
    public ResponseEntity<?> submitCode(@RequestBody SubmissionRequest request,
                                        @AuthenticationPrincipal CustomUserDetails userDetails) {
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userDetails.getId()));

        Submission submission = submissionService.saveInitialSubmission(user, request);
        Problem problem = submission.getProblem();

        // Setup isolated folder
        String folder = "/tmp/sub_" + UUID.randomUUID();
        File dir = new File(folder);
        dir.mkdirs();

        String filename = switch (request.getLanguage()) {
            case "cpp" -> "main.cpp";
            case "java" -> "Main.java";
            case "python3" -> "script.py";
            default -> throw new IllegalArgumentException("Unsupported language");
        };

        try {
            // Write submitted source code
            Files.writeString(Paths.get(folder, filename), request.getCode());

            // Copy judge.sh
            Path judgeScript = Paths.get(folder, "judge.sh");
            Files.copy(new ClassPathResource("judge.sh").getInputStream(), judgeScript, StandardCopyOption.REPLACE_EXISTING);
            judgeScript.toFile().setExecutable(true);

            String verdict = "Accepted";

            // 1. Run sample test cases
            for (int i = 0; i < problem.getSampleTestcases().size(); i++) {
                TestCase test = problem.getSampleTestcases().get(i);
                String result = runTest(folder, filename, request.getLanguage(), test);
                if (!"Accepted".equals(result)) {
                    verdict = result + " on sample test #" + (i + 1);
                    break;
                }
            }

            // 2. Run system test cases only if samples passed
            if ("Accepted".equals(verdict)) {
                for (int i = 0; i < problem.getSystemTestcases().size(); i++) {
                    TestCase test = problem.getSystemTestcases().get(i);
                    String result = runTest(folder, filename, request.getLanguage(), test);
                    if (!"Accepted".equals(result)) {
                        verdict = result + " on system test #" + (i + 1);
                        break;
                    }
                }
            }

            submissionService.updateVerdict(submission, verdict);
            return ResponseEntity.ok(new APIResponse("Verdict: " + verdict, true));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body(new APIResponse("Judging failed: " + e.getMessage(), false));
        }
    }

    private String runTest(String folder, String filename, String language, TestCase testCase) throws IOException, InterruptedException {
        Path inputPath = Paths.get(folder, "input.txt");
        Path expectedPath = Paths.get(folder, "expected.txt");

        Files.writeString(inputPath, testCase.getInput());
        Files.writeString(expectedPath, testCase.getOutput());

        ProcessBuilder pb = new ProcessBuilder("./judge.sh", language, filename, "input.txt", "expected.txt");
        pb.directory(new File(folder));
        pb.redirectErrorStream(true);
        Process proc = pb.start();
        proc.waitFor();

        Path verdictPath = Paths.get(folder, "verdict.txt");
        return Files.readString(verdictPath).trim();
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMySubmissions(@AuthenticationPrincipal CustomUserDetails userDetails) {
        List<Submission> submissions = submissionService.getSubmissionsByUserId(userDetails.getId());
        List<SubmissionResponseDTO> dtoList = submissions.stream()
                .map(submissionService::mapToDTO)
                .toList();
        return ResponseEntity.ok(dtoList);
    }


    @GetMapping("/problem/{problemId}")
    @RolesAllowed({"ROLE_USER", "ROLE_ADMIN"})
    public ResponseEntity<?> getSubmissionsByProblemId(@PathVariable Long problemId,
                                                       @AuthenticationPrincipal CustomUserDetails userDetails) {
        Long userId = userDetails.getId();
        List<Submission> submissions = submissionService.getSubmissionsByProblemIdAndUserId(problemId, userId);
        List<SubmissionResponseDTO> dtoList = submissions.stream()
                .map(submissionService::mapToDTO)
                .toList();
        return ResponseEntity.ok(dtoList);
    }


    @GetMapping("/my/activity")
    @RolesAllowed({"ROLE_USER", "ROLE_ADMIN"})
    public ResponseEntity<?> getMySubmissionActivity(@AuthenticationPrincipal CustomUserDetails userDetails) {
        Map<String, Integer> activityMap = submissionService.getActivityMapForUser(userDetails.getId());
        return ResponseEntity.ok(activityMap);
    }
    @GetMapping("/{id}")
    @RolesAllowed({"ROLE_USER", "ROLE_ADMIN"})
    public ResponseEntity<?> getSubmissionById(@PathVariable Long id,
                                               @AuthenticationPrincipal CustomUserDetails userDetails) {
        Submission submission = submissionService.getSubmissionById(id);

        boolean isAdmin = userDetails.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));

        // If not admin, restrict access to own submission only
        if (!isAdmin && !submission.getUser().getId().equals(userDetails.getId())) {
            return ResponseEntity.status(403).body(new APIResponse("Not allowed to view this resource", false));
        }

        SubmissionResponseDTO dto = submissionService.mapToDTO(submission);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/all")
    @RolesAllowed("ROLE_ADMIN")
    public ResponseEntity<?> getAllSubmissions() {
        List<Submission> submissions = submissionService.getAllSubmissions();
        List<SubmissionResponseDTO> dtoList = submissions.stream()
                .map(submissionService::mapToDTO)
                .toList();
        return ResponseEntity.ok(dtoList);
    }




}
