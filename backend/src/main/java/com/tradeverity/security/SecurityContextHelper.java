package com.tradeverity.security;

import com.tradeverity.domain.User;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class SecurityContextHelper {

    public Optional<User> getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof User) {
            return Optional.of((User) auth.getPrincipal());
        }
        return Optional.empty();
    }

    public Long getCurrentUserId() {
        return getCurrentUser().map(User::getUserId).orElse(null);
    }
}
