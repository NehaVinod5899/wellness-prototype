package com.dissertation.wellness.contact;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * A contact usable from the Messages screen and/or the Wellbeing
 * quick-contact escalation feature
 */
@Entity
@Table(name = "contacts")
public class Contact {

    public enum Role { REGULAR, FAVOURITE, EMERGENCY }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    @NotBlank
    private String phoneNumber;

    @NotNull
    @Enumerated(EnumType.STRING)
    private Role role = Role.REGULAR;

    protected Contact() {
    }

    public Contact(String name, String phoneNumber, Role role) {
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.role = role;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
}
