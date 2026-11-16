package com.tradeverity.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;

import jakarta.annotation.PostConstruct;
import java.io.InputStream;

@Configuration
public class FirebaseConfig {
    private static final Logger log = LoggerFactory.getLogger(FirebaseConfig.class);

    @Value("${tradeverity.firebase.config-path:}")
    private String configPath;

    private final ResourceLoader resourceLoader;

    public FirebaseConfig(ResourceLoader resourceLoader) {
        this.resourceLoader = resourceLoader;
    }

    @PostConstruct
    public void init() {
        if (!FirebaseApp.getApps().isEmpty()) {
            return;
        }

        try {
            if (configPath != null && !configPath.trim().isEmpty()) {
                Resource resource = resourceLoader.getResource(configPath);
                if (resource.exists()) {
                    try (InputStream is = resource.getInputStream()) {
                        FirebaseOptions options = FirebaseOptions.builder()
                            .setCredentials(GoogleCredentials.fromStream(is))
                            .build();
                        FirebaseApp.initializeApp(options);
                        log.info("Firebase Admin SDK successfully initialized from service account credentials.");
                        return;
                    }
                }
            }
            log.info("No external service account credentials found. Initializing Firebase in development verification mode.");
        } catch (Exception e) {
            log.warn("Could not load Firebase service account (dev mode active): {}", e.getMessage());
        }
    }
}
