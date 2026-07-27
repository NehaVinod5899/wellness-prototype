package com.dissertation.wellness.wellbeing;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Endpoints for the Wellbeing check-in feature (Section 5.4, Wellbeing screen).
 *
 * GET  /api/checkins       - most recent check-ins first (used to show check-in history)
 * POST /api/checkins       - record a new mood check-in, optionally flagged as escalated
 *                            when the user also tapped "Call favourite contact" /
 *                            "Call emergency" (DR-8, DR-9)
 */
@RestController
@RequestMapping("/api/checkins")
public class CheckInController {

    private final CheckInRepository repository;

    public CheckInController(CheckInRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<CheckIn> getAll() {
        return repository.findAllByOrderByCreatedAtDesc();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CheckIn create(@Valid @RequestBody CheckInRequest request) {
        CheckIn checkIn = new CheckIn(request.getMood(), request.isEscalated());
        return repository.save(checkIn);
    }
}
