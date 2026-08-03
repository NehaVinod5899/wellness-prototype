package com.dissertation.wellness.profile;

import jakarta.validation.Valid;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final ProfileRepository repository;

    public ProfileController(ProfileRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public ResponseEntity<ProfileResponse> get() {
        return repository.findById(1L)
            .map(p -> ResponseEntity.ok(new ProfileResponse(p)))
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ProfileResponse setup(@Valid @RequestBody ProfileSetupRequest request) {
        if (request.isPinEnabled() && (request.getPinCode() == null || !request.getPinCode().matches("\\d{4}")))
            throw new IllegalArgumentException("PIN must be exactly 4 digits when enabled");
        return new ProfileResponse(repository.save(new Profile(request.getName(), request.isPinEnabled(), request.getPinCode())));
    }

    @PostMapping("/verify-pin")
    public Map<String, Boolean> verifyPin(@Valid @RequestBody PinVerifyRequest request) {
        boolean valid = repository.findById(1L)
            .map(p -> p.isPinEnabled() && request.getPin().equals(p.getPinCode()))
            .orElse(false);
        return Map.of("valid", valid);
    }
}