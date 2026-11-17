package com.tradeverity.config;

import com.tradeverity.security.FirebaseAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final FirebaseAuthenticationFilter firebaseAuthFilter;

    public SecurityConfig(FirebaseAuthenticationFilter firebaseAuthFilter) {
        this.firebaseAuthFilter = firebaseAuthFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(AbstractHttpConfigurer::disable)
            .headers(headers -> headers.frameOptions(HeadersConfigurer.FrameOptionsConfig::disable))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Public / unauthenticated paths (citizen reporting, metrics, lookups)
                .requestMatchers("/h2-console/**", "/error", "/api/v1/metrics/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/v1/users/bootstrap").permitAll()
                .requestMatchers("/api/v1/users/me").permitAll()
                .requestMatchers("/api/v1/cases/**").permitAll()
                .requestMatchers("/api/v1/intelligence/**").permitAll()
                .requestMatchers("/api/v1/entities/**").permitAll()
                .requestMatchers("/api/v1/reports/**").permitAll()
                .requestMatchers("/api/v1/verification/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/admin/sources/**").permitAll()
                // Role-restricted reviewer & admin paths
                .requestMatchers("/api/v1/review/**").hasAnyRole("REVIEWER", "ADMIN")
                .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
                // All other operations authenticated
                .anyRequest().authenticated()
            )
            .addFilterBefore(firebaseAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of("*"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With", "Accept"));
        config.setExposedHeaders(Arrays.asList("Content-Disposition"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
