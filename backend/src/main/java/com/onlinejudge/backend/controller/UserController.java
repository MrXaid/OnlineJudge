package com.onlinejudge.backend.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.onlinejudge.backend.payload.request.UserUpdateRequest;
import com.onlinejudge.backend.payload.APIResponse;
import com.onlinejudge.backend.payload.response.UserProfileResponse;
import com.onlinejudge.backend.payload.response.UserPublicProfileResponse;
import com.onlinejudge.backend.repository.UserRepository;
import com.onlinejudge.backend.security.services.CustomUserDetails;
import com.onlinejudge.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;

    // ✅ GET /api/users/me
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new APIResponse("Login required to access this resource.", false));
        }
        return ResponseEntity.ok(userService.getCurrentUserProfile());
    }

    // ✅ PUT /api/users/me
//    @PutMapping("/me")
//    public ResponseEntity<APIResponse> updateProfile(@RequestBody UserUpdateRequest request,
//                                                     Authentication authentication) {
//        if (authentication == null || !authentication.isAuthenticated()) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
//                    .body(new APIResponse("Login required to access this resource.", false));
//        }
//        userService.updateCurrentUserProfile(request);
//        return ResponseEntity.ok(new APIResponse("Profile updated successfully", true));
//    }

    // ✅ PUT /api/users/me (updated version with image support)
//    @PutMapping(value = "/me", consumes = {"multipart/form-data"})
//    public ResponseEntity<APIResponse> updateProfile(@RequestPart("data") UserUpdateRequest request,
//                                                     @RequestPart(value = "image", required = false) MultipartFile image,
//                                                     Authentication authentication) {
//        if (authentication == null || !authentication.isAuthenticated()) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
//                    .body(new APIResponse("Login required to access this resource.", false));
//        }
//
//        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
//        userService.updateCurrentUserProfile(request, image, userDetails.getId());
//
//        return ResponseEntity.ok(new APIResponse("Profile updated successfully", true));
//    }

    @PostMapping(value = "/me", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<APIResponse> updateProfile(
            @RequestPart(value = "data", required = false) String data,
            @RequestPart(value = "image", required = false) MultipartFile image,
            Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new APIResponse("Login required to access this resource.", false));
        }

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        UserUpdateRequest request = null;

        // 🌐 Safely parse 'data' JSON only if present
        if (data != null && !data.isBlank()) {
            try {
                ObjectMapper mapper = new ObjectMapper();
                request = mapper.readValue(data, UserUpdateRequest.class);
            } catch (JsonProcessingException e) {
                return ResponseEntity.badRequest()
                        .body(new APIResponse("Invalid JSON in 'data' field: " + e.getOriginalMessage(), false));
            }
        }

        // 💾 Delegate to service for partial update logic
        userService.updateCurrentUserProfile(request, image, userDetails.getId());

        return ResponseEntity.ok(new APIResponse("Profile updated successfully", true));
    }



    @GetMapping("/me/summary")
    public ResponseEntity<?> getUserSummary(Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        return ResponseEntity.ok(userService.getUserStats(userDetails.getId()));
    }

    @GetMapping("/all")
//    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // ✅ DELETE /api/users/{username} – Admin only
    @DeleteMapping("/{username}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<APIResponse> deleteUserByUsername(@PathVariable String username) {
        try {
            userService.deleteUserByUsername(username);
            return ResponseEntity.ok(new APIResponse("User deleted successfully.", true));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new APIResponse(e.getMessage(), false));
        }
    }





    // 🌐 GET /api/users/{username}
    @GetMapping("/{username}")
    public ResponseEntity<UserPublicProfileResponse> getUserByUsername(@PathVariable String username) {
        return ResponseEntity.ok(userService.getPublicProfileByUsername(username));
    }
}
