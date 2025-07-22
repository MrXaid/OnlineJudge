package com.onlinejudge.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "problems")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Problem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ElementCollection
    private List<String> tags;

    private int countAC;
    private int countTotal;

    private String name;
    private String author;
    private String difficulty;
    @Column(columnDefinition = "TEXT")
    private String statement;

    @Column(columnDefinition = "TEXT")
    private String explanation;

    // ✅ Separate lists for sample/system test cases
    @ElementCollection
    @CollectionTable(name = "sample_testcases", joinColumns = @JoinColumn(name = "problem_id"))
    private List<TestCase> sampleTestcases;

    @ElementCollection
    @CollectionTable(name = "system_testcases", joinColumns = @JoinColumn(name = "problem_id"))
    private List<TestCase> systemTestcases;

    private double time;  // seconds
    private int memory;   // MB
}