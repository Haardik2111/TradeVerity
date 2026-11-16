package com.tradeverity;

import com.tradeverity.correlation.NormalizationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class NormalizationServiceTest {

    private NormalizationService normalizationService;

    @BeforeEach
    void setUp() {
        normalizationService = new NormalizationService();
    }

    @Test
    @DisplayName("Should normalize website URL to canonical host without www")
    void testNormalizeUrl() {
        String result = normalizationService.normalizeIdentifier("https://www.apexalpha-invest.online/dl/app.apk", "URL");
        assertEquals("apexalpha-invest.online", result);
    }

    @Test
    @DisplayName("Should normalize UPI handle to lowercase without whitespace")
    void testNormalizeUpi() {
        String result = normalizationService.normalizeIdentifier("  DhanVridhi.Pay@OkFictioBank  ", "PAYMENT_UPI");
        assertEquals("dhanvridhi.pay@okfictiobank", result);
    }

    @Test
    @DisplayName("Should mask middle octets of sensitive UPI identifier")
    void testMaskUpi() {
        String masked = normalizationService.maskIdentifier("dhanvridhi.pay@okfictiobank", "PAYMENT_UPI");
        assertTrue(masked.contains("***"));
        assertTrue(masked.endsWith("@okfictiobank"));
    }

    @Test
    @DisplayName("Should normalize Indian phone numbers to E.164 +91 format")
    void testNormalizePhone() {
        String normalized = normalizationService.normalizeIdentifier("09876543210", "PHONE_NUMBER");
        assertEquals("+919876543210", normalized);
    }
}
