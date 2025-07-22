package com.onlinejudge.backend.payload.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserPublicProfileResponse {
    private String username;
    private String firstName;
    private String lastName;
    private String country;
    private String description;
    private String photoUrl;
}
