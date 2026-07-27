package com.dissertation.wellness.community;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

/**
 * A suggested community activity (Section 5.4, Community screen).
 * Deliberately surfaced directly with a one-tap join/leave action rather
 * than requiring search or filtering, per DR-1 and DR-8, and the gap
 * identified against Nextdoor/Meetup in Section 3.3.2.
 */
@Entity
@Table(name = "community_groups")
public class CommunityGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    /** e.g. "Tuesday 10:00" - kept as a single display string for simplicity in this prototype. */
    @NotBlank
    private String schedule;

    private boolean joined = false;

    protected CommunityGroup() {
    }

    public CommunityGroup(String name, String schedule) {
        this.name = name;
        this.schedule = schedule;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getSchedule() { return schedule; }
    public void setSchedule(String schedule) { this.schedule = schedule; }
    public boolean isJoined() { return joined; }
    public void setJoined(boolean joined) { this.joined = joined; }
}
