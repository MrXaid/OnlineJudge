package com.onlinejudge.backend.service;

import com.onlinejudge.backend.exception.APIException;
import com.onlinejudge.backend.exception.ResourceNotFoundException;
import com.onlinejudge.backend.model.Role;
import com.onlinejudge.backend.model.Submission;
import com.onlinejudge.backend.model.User;
import com.onlinejudge.backend.payload.response.UserStatsResponse;
import com.onlinejudge.backend.repository.SubmissionRepository;
import com.onlinejudge.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.onlinejudge.backend.payload.request.UserUpdateRequest;
import com.onlinejudge.backend.payload.response.UserProfileResponse;
import com.onlinejudge.backend.payload.response.UserPublicProfileResponse;
import com.onlinejudge.backend.security.services.CustomUserDetails;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final SubmissionRepository submissionRepository;

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User", "username", username));
    }
    public UserProfileResponse getCurrentUserProfile() {
        CustomUserDetails userDetails = (CustomUserDetails)
                SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userDetails.getId()));

        return new UserProfileResponse(
                user.getFirstName(),
                user.getLastName(),
                user.getUsername(),
                user.getEmail(),
                user.getContact(),
                user.getCountry(),
                user.getDescription(),
                user.getDate(),
                user.getRole().name(),
                "/uploads/" + user.getPhoto()
        );
    }

//    public void updateCurrentUserProfile(UserUpdateRequest updateRequest) {
//        CustomUserDetails userDetails = (CustomUserDetails)
//                SecurityContextHolder.getContext().getAuthentication().getPrincipal();
//
//        User user = userRepository.findById(userDetails.getId())
//                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userDetails.getId()));
//
//        // Update only allowed fields
//        user.setFirstName(updateRequest.getFirstName());
//        user.setLastName(updateRequest.getLastName());
//        user.setContact(updateRequest.getContact());
//        user.setCountry(updateRequest.getCountry());
//        user.setDescription(updateRequest.getDescription());
//
//        userRepository.save(user);
//    }

    public void updateCurrentUserProfile(UserUpdateRequest updateRequest, MultipartFile image, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        // 🧠 Update only non-null fields
        if (updateRequest != null) {
            if (updateRequest.getFirstName() != null) user.setFirstName(updateRequest.getFirstName());
            if (updateRequest.getLastName() != null) user.setLastName(updateRequest.getLastName());
            if (updateRequest.getContact() != null) user.setContact(updateRequest.getContact());
            if (updateRequest.getCountry() != null) user.setCountry(updateRequest.getCountry());
            if (updateRequest.getDescription() != null) user.setDescription(updateRequest.getDescription());
        }

        // 🖼️ Handle optional image upload
        if (image != null && !image.isEmpty()) {
            try {
                String extension = Objects.requireNonNull(image.getOriginalFilename())
                        .substring(image.getOriginalFilename().lastIndexOf('.') + 1);

                String filename = userId + "." + extension;

                Path uploadDir = Paths.get("uploads");
                if (!Files.exists(uploadDir)) {
                    Files.createDirectories(uploadDir);
                }

                // Full path for new file
                Path newImagePath = uploadDir.resolve(filename);

                // Delete old file if it's not default.png
                if (user.getPhoto() != null && !user.getPhoto().equals("default.png")) {
                    Path oldImagePath = uploadDir.resolve(user.getPhoto());
                    if (Files.exists(oldImagePath)) {
                        Files.delete(oldImagePath);
                    }
                }

                // Save new file
                Files.write(newImagePath, image.getBytes());

                user.setPhoto(filename);
            } catch (IOException e) {
                throw new APIException("Failed to upload image: " + e.getMessage());
            }
        }

        userRepository.save(user);
    }


    public UserPublicProfileResponse getPublicProfileByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        return new UserPublicProfileResponse(
                user.getUsername(),
                user.getFirstName(),
                user.getLastName(),
                user.getCountry(),
                user.getDescription(),
                "/uploads/" + user.getPhoto()
        );
    }
    public UserStatsResponse getUserStats(Long userId) {
        // Fetch user or throw
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        // Use the optimized query to avoid lazy loading + LOB issues
        List<Submission> submissions = submissionRepository.findAllWithProblemByUserId(userId);

        // Compute stats
        int total = submissions.size();
        long accepted = submissions.stream()
                .filter(s -> "Accepted".equals(s.getVerdict()))
                .count();
        long attempted = submissions.stream()
                .map(s -> s.getProblem().getId())
                .distinct()
                .count();

        return new UserStatsResponse(total, (int) accepted, (int) attempted);
    }


    public List<UserPublicProfileResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> new UserPublicProfileResponse(
                        user.getUsername(),
                        user.getFirstName(),
                        user.getLastName(),
                        user.getCountry(),
                        user.getDescription(),
                        user.getPhoto()))
                .toList();
    }

    public void deleteUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        if (user.getRole() == Role.ADMIN) {
            throw new IllegalArgumentException("Cannot delete a user with ADMIN role.");
        }

        userRepository.delete(user);
    }


}
