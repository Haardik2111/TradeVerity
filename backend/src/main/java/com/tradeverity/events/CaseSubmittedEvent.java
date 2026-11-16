package com.tradeverity.events;

import com.tradeverity.domain.CaseReport;
import org.springframework.context.ApplicationEvent;

public class CaseSubmittedEvent extends ApplicationEvent {
    private final CaseReport caseReport;

    public CaseSubmittedEvent(Object source, CaseReport caseReport) {
        super(source);
        this.caseReport = caseReport;
    }

    public CaseReport getCaseReport() {
        return caseReport;
    }
}
