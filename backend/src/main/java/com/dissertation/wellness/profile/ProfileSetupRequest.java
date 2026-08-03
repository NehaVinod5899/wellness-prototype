package com.dissertation.wellness.profile;

import jakarta.validation.constraints.NotBlank;

public class ProfileSetupRequest {

    @NotBlank
    private String name;

    private boolean pinEnabled;

    private String pinCode;

    public ProfileSetupRequest() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean isPinEnabled() {
        return pinEnabled;
    }

    public void setPinEnabled(boolean pinEnabled) {
        this.pinEnabled = pinEnabled;
    }

    public String getPinCode() {
        return pinCode;
    }

    public void setPinCode(String pinCode) {
        this.pinCode = pinCode;
    }
}