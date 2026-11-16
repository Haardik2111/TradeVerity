package com.tradeverity.controller;

import com.tradeverity.domain.User;
import com.tradeverity.dto.UserBootstrapDto;
import com.tradeverity.repository.UserRepository;
import com.tradeverity.security.SecurityContextHelper;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserRepository userRepository;
    private final SecurityContextHelper securityContextHelper;

    public UserController(UserRepository userRepository, SecurityContextHelper securityContextHelper) {
        this.userRepository = userRepository;
        this.securityContextHelper = securityContextHelper;
    }

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser() {
        return securityContextHelper.getCurrentUser()
            .map(ResponseEntity::ok)
            .orElseGet(() -> {
                // Return default demo user if unauthenticated in dev
                return userRepository.findByFirebaseUid("demo-analyst-arjun")
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
            });
    }

    @PostMapping("/bootstrap")
    public ResponseEntity<User> bootstrapUser(@Valid @RequestBody UserBootstrapDto dto) {
        Optional<User> existing = userRepository.findByFirebaseUid(dto.getUid());
        if (existing.isPresent()) {
            User user = existing.get();
            if (dto.getDisplayName() != null && !dto.getDisplayName().isEmpty()) {
                user.setFullName(dto.getDisplayName());
            }
            if (dto.getPhotoUrl() != null) {
                user.setPhotoUrl(dto.getPhotoUrl());
            }
            return ResponseEntity.ok(userRepository.save(user));
        }

        User newUser = new User();
        newUser.setFirebaseUid(dto.getUid());
        newUser.setEmail(dto.getEmail());
        newUser.setFullName(dto.getDisplayName());
        // Default role is INVESTOR. REVIEWER and ADMIN must only be assigned by authorized backend operations
        newUser.setRole("INVESTOR");
        newUser.setStatus("ACTIVE");
        newUser.setPhotoUrl(dto.getPhotoUrl());

        User saved = userRepository.save(newUser);
        return ResponseEntity.ok(saved);
    }

    @PatchMapping("/me")
    public ResponseEntity<User> updateCurrentUser(@RequestBody User updates) {
        Optional<User> currentOpt = securityContextHelper.getCurrentUser();
        if (currentOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = currentOpt.get();
        if (updates.getFullName() != null) user.setFullName(updates.getFullName());
        if (updates.getPhotoUrl() != null) user.setPhotoUrl(updates.getPhotoUrl());

        return ResponseEntity.ok(userRepository.save(user));
    }
}
