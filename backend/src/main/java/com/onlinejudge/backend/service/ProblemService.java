package com.onlinejudge.backend.service;

import com.onlinejudge.backend.model.Problem;
import com.onlinejudge.backend.payload.ProblemAdminResponseDTO;
import com.onlinejudge.backend.payload.ProblemResponseDTO;
import com.onlinejudge.backend.repository.ProblemRepository;
import com.onlinejudge.backend.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProblemService {

    private final ProblemRepository problemRepository;

    public Problem createProblem(Problem problem) {
        if (problemRepository.existsByName(problem.getName())) {
            throw new IllegalArgumentException("Problem already exists with the same name");
        }
        return problemRepository.save(problem);
    }

    public List<Problem> getAllProblems() {
        return problemRepository.findAll();
    }


    public Problem getProblemById(Long id) {
        return problemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Problem", "id", id));
    }

    public void deleteProblem(Long id) {
        Problem problem = getProblemById(id);
        problemRepository.delete(problem); // Test cases deleted via @ElementCollection
    }

    public List<Problem> getTop10ByAC() {
        return problemRepository.findTop10ByOrderByCountACDesc();
    }

    public List<Problem> searchProblemsByTags(List<String> tags) {
        return problemRepository.findAll().stream()
                .filter(p -> {
                    List<String> problemTags = p.getTags();
                    return problemTags != null &&
                            tags.stream().allMatch(tag ->
                                    problemTags.stream().anyMatch(t -> t.equalsIgnoreCase(tag)));
                })
                .toList();
    }


    public List<Problem> sortProblems(String sortBy, String order) {
        boolean asc = order.equalsIgnoreCase("asc");

        if (sortBy.equalsIgnoreCase("difficulty")) {
            List<Problem> all = problemRepository.findAll();
            return all.stream()
                    .sorted((p1, p2) -> {
                        int d1 = difficultyRank(p1.getDifficulty());
                        int d2 = difficultyRank(p2.getDifficulty());
                        return asc ? Integer.compare(d1, d2) : Integer.compare(d2, d1);
                    })
                    .toList();
        } else if (sortBy.equalsIgnoreCase("countac")) {
            return asc
                    ? problemRepository.findAllByOrderByCountACAsc()
                    : problemRepository.findAllByOrderByCountACDesc();
        }
        else if (sortBy.equalsIgnoreCase("title")) {
            List<Problem> all = problemRepository.findAll();
            return all.stream()
                    .sorted((p1, p2) -> asc
                            ? p1.getName().compareToIgnoreCase(p2.getName())
                            : p2.getName().compareToIgnoreCase(p1.getName()))
                    .toList();
        }else {
            throw new IllegalArgumentException("Invalid sortBy parameter: " + sortBy);
        }
    }

    public int difficultyRank(String difficulty) {
        if (difficulty == null) return 4;
        return switch (difficulty.trim().toUpperCase()) {
            case "EASY" -> 1;
            case "MEDIUM" -> 2;
            case "HARD" -> 3;
            default -> 4;
        };
    }



    public ProblemResponseDTO mapToUserDTO(Problem problem) {
        return ProblemResponseDTO.builder()
                .id(problem.getId())
                .name(problem.getName())
                .author(problem.getAuthor())
                .difficulty(problem.getDifficulty())
                .statement(problem.getStatement())
                .explanation(problem.getExplanation())
                .tags(problem.getTags())
                .countAC(problem.getCountAC())
                .countTotal(problem.getCountTotal())
                .sampleTestcases(problem.getSampleTestcases())
                .time(problem.getTime())
                .memory(problem.getMemory())
                .build();
    }
    public ProblemAdminResponseDTO mapToAdminDTO(Problem problem) {
        return ProblemAdminResponseDTO.builder()
                .id(problem.getId())
                .name(problem.getName())
                .author(problem.getAuthor())
                .difficulty(problem.getDifficulty())
                .statement(problem.getStatement())
                .explanation(problem.getExplanation())
                .tags(problem.getTags())
                .countAC(problem.getCountAC())
                .countTotal(problem.getCountTotal())
                .sampleTestcases(problem.getSampleTestcases())
                .systemTestcases(problem.getSystemTestcases())
                .time(problem.getTime())
                .memory(problem.getMemory())
                .build();
    }

}
