package com.dissertation.wellness.profile;

public class ProfileResponse {
    private final String name;
    private final boolean pinEnabled;
    public ProfileResponse(Profile p) { this.name = p.getName(); this.pinEnabled = p.isPinEnabled(); }
    public String getName() {
        return name;
    }
    public boolean isPinEnabled() {
        return pinEnabled;
    }
    
}
