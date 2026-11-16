package com.tradeverity.correlation;

import org.springframework.stereotype.Service;

import java.net.URI;
import java.util.Locale;

@Service
public class NormalizationService {

    public String normalizeIdentifier(String raw, String type) {
        if (raw == null || raw.trim().isEmpty()) return "";
        String clean = raw.trim();

        if ("URL".equalsIgnoreCase(type) || "WEBSITE".equalsIgnoreCase(type)) {
            try {
                if (!clean.startsWith("http://") && !clean.startsWith("https://")) {
                    clean = "https://" + clean;
                }
                String host = URI.create(clean).getHost();
                if (host != null) {
                    if (host.startsWith("www.")) host = host.substring(4);
                    return host.toLowerCase(Locale.ROOT);
                }
            } catch (Exception e) {
                return clean.toLowerCase(Locale.ROOT);
            }
        }

        if ("PAYMENT_UPI".equalsIgnoreCase(type) || "UPI".equalsIgnoreCase(type)) {
            return clean.toLowerCase(Locale.ROOT).replaceAll("\\s+", "");
        }

        if ("PHONE_NUMBER".equalsIgnoreCase(type) || "PHONE".equalsIgnoreCase(type)) {
            String digits = clean.replaceAll("[^0-9]", "");
            if (digits.length() == 11 && digits.startsWith("0")) {
                digits = digits.substring(1);
            }
            if (digits.length() == 10) {
                return "+91" + digits;
            } else if (digits.length() == 12 && digits.startsWith("91")) {
                return "+" + digits;
            }
            return digits;
        }

        if ("REGISTRATION_NO".equalsIgnoreCase(type)) {
            return clean.toUpperCase(Locale.ROOT).replaceAll("[^A-Z0-9]", "");
        }

        return clean;
    }

    public String maskIdentifier(String normalized, String type) {
        if (normalized == null || normalized.isEmpty()) return "";

        if ("PHONE_NUMBER".equalsIgnoreCase(type) || "PHONE".equalsIgnoreCase(type)) {
            if (normalized.length() >= 10) {
                return normalized.substring(0, Math.min(8, normalized.length())) + "*****";
            }
        }

        if ("PAYMENT_UPI".equalsIgnoreCase(type) || "UPI".equalsIgnoreCase(type)) {
            int at = normalized.indexOf('@');
            if (at > 3) {
                return normalized.substring(0, Math.min(6, at)) + "***" + normalized.substring(at);
            }
        }

        return normalized;
    }
}
