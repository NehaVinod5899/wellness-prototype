package com.dissertation.wellness.wellbeing;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;

/**
 * A single daily mood check-in.
 * Maps to the "Daily mood check-in" feature (Section 5.4) and the
 * three-option design constraint from DR-5 (one primary action per screen) -
 * mood is restricted to the three states already validated in the prototype
 * (Happy / Okay / Not Great), not a free-text or numeric scale, matching the
 * rationale recorded in Section 5.6, peer feedback point 1.
 */
@Entity
@Table(name = "check_ins")
public class CheckIn {

    public enum Mood { HAPPY, OKAY, NOT_GREAT }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Enumerated(EnumType.STRING)
    private Mood mood;

    /** True if a favourite-contact or emergency escalation was triggered from this check-in. */
    private boolean escalated = false;

    @NotNull
    private Instant createdAt = Instant.now();

    protected CheckIn() {
        // required by JPA
    }

    public CheckIn(Mood mood, boolean escalated) {
        this.mood = mood;
        this.escalated = escalated;
        this.createdAt = Instant.now();
    }

    public Long getId() { return id; }
    public Mood getMood() { return mood; }
    public void setMood(Mood mood) { this.mood = mood; }
    public boolean isEscalated() { return escalated; }
    public void setEscalated(boolean escalated) { this.escalated = escalated; }
    public Instant getCreatedAt() { return createdAt; }
}
