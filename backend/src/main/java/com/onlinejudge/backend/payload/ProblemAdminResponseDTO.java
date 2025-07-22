package com.onlinejudge.backend.payload;

import com.onlinejudge.backend.model.TestCase;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProblemAdminResponseDTO {
    private Long id;
    private String name;
    private String author;
    private String statement;
    private String explanation;
    private String difficulty;
    private List<String> tags;
    private int countAC;
    private int countTotal;
    private List<TestCase> sampleTestcases;
    private List<TestCase> systemTestcases;
    private double time;
    private int memory;
}
