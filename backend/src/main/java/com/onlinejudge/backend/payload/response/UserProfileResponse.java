package com.onlinejudge.backend.payload.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserProfileResponse {
    private String firstName;
    private String lastName;
    private String username;
    private String email;
    private String contact;
    private String country;
    private String description;
    private String date;
    private String role; // read-only
    private String photoUrl;
}

