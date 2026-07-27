package com.dissertation.wellness.contact;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ContactRepository extends JpaRepository<Contact, Long> {
    List<Contact> findByRole(Contact.Role role);
    Optional<Contact> findFirstByRole(Contact.Role role);
}
