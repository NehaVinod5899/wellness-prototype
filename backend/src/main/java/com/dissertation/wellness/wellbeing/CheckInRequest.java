package com.dissertation.wellness.wellbeing;

import jakarta.validation.constraints.NotNull;

/** Request body for POST /api/checkins */
public class CheckInRequest {

    @NotNull
    private CheckIn.Mood mood;

    private boolean escalated = false;

    public CheckIn.Mood getMood() { return mood; }
    public void setMood(CheckIn.Mood mood) { this.mood = mood; }
    public boolean isEscalated() { return escalated; }
    public void setEscalated(boolean escalated) { this.escalated = escalated; }
}
