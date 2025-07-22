package com.onlinejudge.backend.controller;

import com.onlinejudge.backend.model.Problem;
import com.onlinejudge.backend.model.Role;
import com.onlinejudge.backend.model.User;
import com.onlinejudge.backend.payload.APIResponse;
import com.onlinejudge.backend.payload.ProblemAdminResponseDTO;
import com.onlinejudge.backend.payload.ProblemResponseDTO;
import com.onlinejudge.backend.service.ProblemService;
import com.onlinejudge.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Comparator;
import java.util.List;

@RestController
@RequestMapping("/api/problems")
@RequiredArgsConstructor
public class ProblemController {

    private final ProblemService problemService;
    private final UserService userService;

    @PostMapping("/create")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Problem> createProblem(@RequestBody Problem problem) {
        Problem created = problemService.createProblem(problem);
        return ResponseEntity.ok(created);
    }
    @GetMapping("/create")
    public ResponseEntity<APIResponse> handleInvalidGetCreate() {
        return new ResponseEntity<>(
                new APIResponse("Request method 'GET' is not supported for /api/problems/create", false),
                HttpStatus.METHOD_NOT_ALLOWED
        );
    }

    // GET /api/problems/top - Top 10 most solved (by AC)
    @GetMapping("/top")
    public ResponseEntity<List<ProblemResponseDTO>> getTop10ByAC() {
        List<Problem> topProblems = problemService.getTop10ByAC();
        List<ProblemResponseDTO> dtoList = topProblems.stream()
                .map(problemService::mapToUserDTO)
                .toList();
        return ResponseEntity.ok(dtoList);
    }

    // GET /api/problems/search?tags=dp,graph - Search by tags (public)
    @GetMapping("/search")
    public ResponseEntity<List<ProblemResponseDTO>> searchByTags(@RequestParam List<String> tags) {
        List<Problem> matched = problemService.searchProblemsByTags(tags);
        List<ProblemResponseDTO> dtoList = matched.stream()
                .map(problemService::mapToUserDTO)
                .toList();
        return ResponseEntity.ok(dtoList);
    }

    // GET /api/problems/sort?sortBy=difficulty&order=asc - Sort problems
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @GetMapping("/sort")
    public ResponseEntity<List<ProblemResponseDTO>> sortProblems(
            @RequestParam String sortBy,
            @RequestParam(defaultValue = "asc") String order) {

        List<Problem> sorted = problemService.sortProblems(sortBy, order);
        List<ProblemResponseDTO> dtoList = sorted.stream()
                .map(problemService::mapToUserDTO)
                .toList();
        return ResponseEntity.ok(dtoList);
    }


//    @GetMapping
//    public ResponseEntity<List<ProblemResponseDTO>> getAllProblems() {
//        List<Problem> problems = problemService.getAllProblems();
//        List<ProblemResponseDTO> dtoList = problems.stream()
//                .map(problemService::mapToUserDTO)
//                .toList();
//        return ResponseEntity.ok(dtoList);
//    }

    @GetMapping
    public ResponseEntity<List<ProblemResponseDTO>> getAllProblems(
            @RequestParam(required = false) String difficulty,
            @RequestParam(required = false) List<String> tags,
            @RequestParam(required = false, defaultValue = "title") String sortBy,
            @RequestParam(required = false, defaultValue = "asc") String order,
            @RequestParam(required = false) String search // NEW PARAM
    ) {
        List<Problem> problems = problemService.getAllProblems();

        // Filter by difficulty (case-insensitive)
        if (difficulty != null && !difficulty.isBlank()) {
            problems = problems.stream()
                    .filter(p -> p.getDifficulty() != null &&
                            p.getDifficulty().equalsIgnoreCase(difficulty))
                    .toList();
        }

        // Filter by tags (all requested tags must be present in the problem's tags)
        if (tags != null && !tags.isEmpty()) {
            problems = problems.stream()
                    .filter(p -> p.getTags() != null &&
                            tags.stream().allMatch(tag ->
                                    p.getTags().stream()
                                            .anyMatch(problemTag -> problemTag.equalsIgnoreCase(tag))))
                    .toList();
        }

        // Filter by search query in problem name (case-insensitive)
        if (search != null && !search.isBlank()) {
            String searchLower = search.toLowerCase();
            problems = problems.stream()
                    .filter(p -> p.getName() != null &&
                            p.getName().toLowerCase().contains(searchLower))
                    .toList();
        }

        // Sort the list
        Comparator<Problem> comparator = switch (sortBy.toLowerCase()) {
            case "title" -> Comparator.comparing(Problem::getName, String.CASE_INSENSITIVE_ORDER);
            case "difficulty" -> Comparator.comparingInt(p ->
                    problemService.difficultyRank(p.getDifficulty()));
            default -> Comparator.comparing(Problem::getName, String.CASE_INSENSITIVE_ORDER);
        };

        if (order.equalsIgnoreCase("desc")) {
            comparator = comparator.reversed();
        }

        problems = problems.stream()
                .sorted(comparator)
                .toList();

        // Map to DTO
        List<ProblemResponseDTO> dtoList = problems.stream()
                .map(problemService::mapToUserDTO)
                .toList();

        return ResponseEntity.ok(dtoList);
    }



    @GetMapping("/{id}")
    public ResponseEntity<?> getProblemById(@PathVariable Long id, Principal principal) {
        Problem problem = problemService.getProblemById(id);
        User user = userService.getUserByUsername(principal.getName());

        if (user.getRole() == Role.ADMIN) {
            ProblemAdminResponseDTO adminDTO = problemService.mapToAdminDTO(problem);
            return ResponseEntity.ok(adminDTO);
        }

        ProblemResponseDTO userDTO = problemService.mapToUserDTO(problem);
        return ResponseEntity.ok(userDTO);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteProblem(@PathVariable Long id) {
        problemService.deleteProblem(id);
        return ResponseEntity.ok("Problem deleted successfully");
    }
}
