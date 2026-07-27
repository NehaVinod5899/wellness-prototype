package com.dissertation.wellness.community;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Endpoints for the Community screen's "Suggested groups" feature.
 * GET  /api/groups             - list all suggested groups with current joined state
 * POST /api/groups/{id}/join   - one-tap join (DR-1, DR-8)
 * POST /api/groups/{id}/leave  - leave a previously joined group
 */
@RestController
@RequestMapping("/api/groups")
public class CommunityGroupController {

    private final CommunityGroupRepository repository;

    public CommunityGroupController(CommunityGroupRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<CommunityGroup> getAll() {
        return repository.findAll();
    }

    @PostMapping("/{id}/join")
    public ResponseEntity<CommunityGroup> join(@PathVariable Long id) {
        return setJoined(id, true);
    }

    @PostMapping("/{id}/leave")
    public ResponseEntity<CommunityGroup> leave(@PathVariable Long id) {
        return setJoined(id, false);
    }

    private ResponseEntity<CommunityGroup> setJoined(Long id, boolean joined) {
        return repository.findById(id)
                .map(group -> {
                    group.setJoined(joined);
                    return ResponseEntity.ok(repository.save(group));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
