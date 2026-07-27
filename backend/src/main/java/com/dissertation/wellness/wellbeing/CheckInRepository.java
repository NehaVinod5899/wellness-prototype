package com.dissertation.wellness.wellbeing;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CheckInRepository extends JpaRepository<CheckIn, Long> {
    List<CheckIn> findAllByOrderByCreatedAtDesc();
}
