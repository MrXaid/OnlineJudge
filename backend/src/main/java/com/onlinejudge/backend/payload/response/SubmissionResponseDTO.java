package com.onlinejudge.backend.payload.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubmissionResponseDTO {
    private Long id;
    private String problemName;
    private String language;
    private String verdict;
    private String date;
    private String code;
    private String username;
    private Long problemId;
}
