package com.onlinejudge.backend.payload.request;

import lombok.Data;

@Data
public class UserUpdateRequest {
    private String firstName;
    private String lastName;
    private String contact;
    private String country;
    private String description;
}

