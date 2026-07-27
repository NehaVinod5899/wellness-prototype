package com.dissertation.wellness;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Entry point for the Wellness prototype backend.
 *
 * This API covers only the three features from the Features table
 * (dissertation Section 5.4) that need persisted, retrievable state:
 *   - Wellbeing check-ins   (DR-4, DR-5, DR-8)
 *   - Contacts (favourite/emergency escalation) (DR-9, DR-10)
 *   - Community groups (suggested groups, join/leave) (DR-1, DR-8)
 *
 * Authentication is out of scope for this prototype (Design Specification,
 * Section 5.2), so all data is single-user / unauthenticated by design.
 */
@SpringBootApplication
public class WellnessApplication {
    public static void main(String[] args) {
        SpringApplication.run(WellnessApplication.class, args);
    }
}
