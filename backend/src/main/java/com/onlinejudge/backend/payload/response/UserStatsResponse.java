package com.onlinejudge.backend.payload.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserStatsResponse {
    private int totalSubmissions;
    private int acceptedSubmissions;
    private int problemsAttempted;
}
