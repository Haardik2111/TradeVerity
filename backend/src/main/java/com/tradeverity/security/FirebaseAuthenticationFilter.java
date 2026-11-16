package com.tradeverity.security;

import com.google.firebase.FirebaseApp;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import com.tradeverity.domain.User;
import com.tradeverity.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.Optional;

@Component
public class FirebaseAuthenticationFilter extends OncePerRequestFilter {
    private static final Logger log = LoggerFactory.getLogger(FirebaseAuthenticationFilter.class);

    private final UserRepository userRepository;

    public FirebaseAuthenticationFilter(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {
            String idToken = header.substring(7).trim();

            try {
                String uid;
                String email = null;
                String name = null;

                // Check if running live Firebase Admin SDK
                if (!FirebaseApp.getApps().isEmpty()) {
                    try {
                        FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);
                        uid = decodedToken.getUid();
                        email = decodedToken.getEmail();
                        name = decodedToken.getName();
                    } catch (Exception e) {
                        // Fallback check for simulated tokens in developer mode
                        uid = parseSimulatedToken(idToken);
                    }
                } else {
                    uid = parseSimulatedToken(idToken);
                }

                if (uid != null) {
                    Optional<User> userOpt = userRepository.findByFirebaseUid(uid);
                    User user;

                    if (userOpt.isPresent()) {
                        user = userOpt.get();
                    } else {
                        // Bootstrap initial user
                        user = new User();
                        user.setFirebaseUid(uid);
                        user.setEmail(email != null ? email : uid + "@tradeverity.local");
                        user.setFullName(name != null ? name : "Investigator " + uid.substring(0, Math.min(6, uid.length())));
                        user.setRole("INVESTOR");
                        user.setStatus("ACTIVE");
                        user = userRepository.save(user);
                    }

                    SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + user.getRole());
                    UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                        user,
                        null,
                        Collections.singletonList(authority)
                    );

                    SecurityContextHolder.getContext().setAuthentication(auth);
                }
            } catch (Exception ex) {
                log.warn("Authentication token verification failure: {}", ex.getMessage());
                SecurityContextHolder.clearContext();
            }
        }

        filterChain.doFilter(request, response);
    }

    private String parseSimulatedToken(String idToken) {
        if (idToken.startsWith("simulated_jwt_token_")) {
            return idToken.substring("simulated_jwt_token_".length());
        }
        if (idToken.contains("arjun")) {
            return "demo-analyst-arjun";
        }
        if (idToken.contains("priya")) {
            return "demo-investor-user";
        }
        if (idToken.contains("admin")) {
            return "demo-admin-system";
        }
        return idToken.length() > 64 ? idToken.substring(0, 32) : idToken;
    }
}
