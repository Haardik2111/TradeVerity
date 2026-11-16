package com.tradeverity.controller;

import com.tradeverity.domain.CaseReport;
import com.tradeverity.domain.EntityLink;
import com.tradeverity.domain.EntityRecord;
import com.tradeverity.repository.CaseReportRepository;
import com.tradeverity.repository.EntityRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/v1")
public class IntelligenceController {

    private final EntityRepository entityRepository;
    private final CaseReportRepository caseReportRepository;

    public IntelligenceController(EntityRepository entityRepository, CaseReportRepository caseReportRepository) {
        this.entityRepository = entityRepository;
        this.caseReportRepository = caseReportRepository;
    }

    @GetMapping("/intelligence/graph")
    public ResponseEntity<Map<String, Object>> getGraphData(@RequestParam(required = false) String filter) {
        List<EntityRecord> entities = entityRepository.findAllEntities();
        List<EntityLink> links = entityRepository.findAllLinks();

        List<Map<String, Object>> nodes = new ArrayList<>();
        int i = 0;
        int total = Math.max(1, entities.size());

        for (EntityRecord entity : entities) {
            Map<String, Object> node = new HashMap<>();
            String nodeId = "node-" + entity.getEntityId();
            node.put("id", nodeId);
            node.put("type", "default");

            // Spatial distribution in a radar cluster layout
            double angle = (2 * Math.PI * i) / total;
            double radius = 180 + (i % 2 == 0 ? 0 : 90);
            int x = (int) (380 + radius * Math.cos(angle));
            int y = (int) (260 + radius * Math.sin(angle));
            node.put("position", Map.of("x", x, "y", y));

            Map<String, Object> data = new HashMap<>();
            data.put("label", entity.getDisplayName());
            data.put("entityType", entity.getEntityType());
            data.put("riskBand", entity.getRiskBand());
            data.put("threatVector", entity.getVerificationStatus());
            data.put("reportsCount", entity.getReportCount());
            data.put("identifier", entity.getEntityIdentifier());
            data.put("firstSeen", entity.getFirstSeenAt() != null ? entity.getFirstSeenAt().toLocalDate().toString() : "2026-10-12");
            data.put("lastSeen", entity.getLastSeenAt() != null ? entity.getLastSeenAt().toLocalDate().toString() : "2026-11-16");

            node.put("data", data);
            nodes.add(node);
            i++;
        }

        List<Map<String, Object>> edges = new ArrayList<>();
        for (EntityLink link : links) {
            Map<String, Object> edge = new HashMap<>();
            edge.put("id", "e-" + link.getLinkId());
            edge.put("source", "node-" + link.getSourceEntityId());
            edge.put("target", "node-" + link.getTargetEntityId());
            edge.put("label", link.getRelationshipLabel());
            edge.put("animated", "EVIDENCE_LINK".equals(link.getRelationshipType()));
            edge.put("data", Map.of(
                "relationshipType", link.getRelationshipType(),
                "confidence", link.getConfidenceScore()
            ));
            edges.add(edge);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("nodes", nodes);
        response.put("edges", edges);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/entities")
    public ResponseEntity<List<EntityRecord>> getAllEntities() {
        return ResponseEntity.ok(entityRepository.findAllEntities());
    }

    @GetMapping("/entities/{id}")
    public ResponseEntity<Map<String, Object>> getEntityDetails(@PathVariable Long id) {
        Optional<EntityRecord> entityOpt = entityRepository.findById(id);
        if (entityOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        EntityRecord entity = entityOpt.get();
        List<EntityLink> links = entityRepository.findLinksByEntityId(id);

        Map<String, Object> result = new HashMap<>();
        result.put("entity", entity);
        result.put("links", links);

        return ResponseEntity.ok(result);
    }
}
