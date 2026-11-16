package com.tradeverity.controller;

import com.tradeverity.domain.VerificationCheck;
import com.tradeverity.dto.VerificationRequestDto;
import com.tradeverity.verification.VerificationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/verification")
public class VerificationController {

    private final VerificationService verificationService;

    public VerificationController(VerificationService verificationService) {
        this.verificationService = verificationService;
    }

    @PostMapping("/check")
    public ResponseEntity<VerificationCheck> performCheck(@Valid @RequestBody VerificationRequestDto dto) {
        VerificationCheck result = verificationService.performCheck(
            dto.getEntityIdentifier(),
            dto.getCategory(),
            dto.getProvider()
        );
        return ResponseEntity.ok(result);
    }

    @GetMapping("/history")
    public ResponseEntity<List<VerificationCheck>> getHistory() {
        return ResponseEntity.ok(verificationService.getRecentHistory());
    }
}
