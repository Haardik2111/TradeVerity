package com.tradeverity.controller;

import com.tradeverity.domain.SourceRecord;
import com.tradeverity.repository.SourceRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/admin/sources")
public class SourceController {

    private final SourceRepository sourceRepository;

    public SourceController(SourceRepository sourceRepository) {
        this.sourceRepository = sourceRepository;
    }

    @GetMapping
    public ResponseEntity<List<SourceRecord>> listSources() {
        return ResponseEntity.ok(sourceRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<SourceRecord> createSource(@RequestBody SourceRecord record) {
        SourceRecord saved = sourceRepository.save(record);
        return ResponseEntity.ok(saved);
    }

    @PatchMapping("/{sourceId}")
    public ResponseEntity<SourceRecord> updateSource(@PathVariable Long sourceId, @RequestBody SourceRecord updates) {
        Optional<SourceRecord> srcOpt = sourceRepository.findById(sourceId);
        if (srcOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        SourceRecord existing = srcOpt.get();
        if (updates.getSourceName() != null) existing.setSourceName(updates.getSourceName());
        if (updates.getSourceUrl() != null) existing.setSourceUrl(updates.getSourceUrl());
        if (updates.getCategory() != null) existing.setCategory(updates.getCategory());
        if (updates.getStatus() != null) existing.setStatus(updates.getStatus());
        if (updates.getDataFreshness() != null) existing.setDataFreshness(updates.getDataFreshness());
        if (updates.getDatasetVersion() != null) existing.setDatasetVersion(updates.getDatasetVersion());

        SourceRecord saved = sourceRepository.save(existing);
        return ResponseEntity.ok(saved);
    }
}
