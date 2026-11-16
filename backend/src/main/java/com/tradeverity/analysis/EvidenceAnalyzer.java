package com.tradeverity.analysis;

import com.tradeverity.domain.EvidenceItem;

public interface EvidenceAnalyzer {
    boolean supports(String evidenceType);
    void analyze(EvidenceItem item);
}
