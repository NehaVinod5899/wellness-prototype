package com.dissertation.wellness.profile;

import jakarta.validation.constraints.NotBlank;

public class PinVerifyRequest {

    @NotBlank
    private String pin;

    public PinVerifyRequest() {
    }

    public String getPin() {
        return pin;
    }

    public void setPin(String pin) {
        this.pin = pin;
    }
}