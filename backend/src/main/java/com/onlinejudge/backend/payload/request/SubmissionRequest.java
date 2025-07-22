// SubmissionRequest.java
package com.onlinejudge.backend.payload.request;

import lombok.Data;

@Data
public class SubmissionRequest {
    private String code;
    private String language;
    private Long problemId;
}
