package com.tradeverity.events;

import com.tradeverity.domain.ReviewerNote;
import org.springframework.context.ApplicationEvent;

public class ReviewerActionEvent extends ApplicationEvent {
    private final ReviewerNote note;

    public ReviewerActionEvent(Object source, ReviewerNote note) {
        super(source);
        this.note = note;
    }

    public ReviewerNote getNote() {
        return note;
    }
}
