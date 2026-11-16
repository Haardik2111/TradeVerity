package com.tradeverity.events;

import com.tradeverity.domain.CaseReport;
import org.springframework.context.ApplicationEvent;

public class AnalysisCompletedEvent extends ApplicationEvent {
    private final CaseReport caseReport;

    public AnalysisCompletedEvent(Object source, CaseReport caseReport) {
        super(source);
        this.caseReport = caseReport;
    }

    public CaseReport getCaseReport() {
        return caseReport;
    }
}
