package com.dissertation.wellness.profile;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity @Table(name = "profile")
public class Profile {
    @Id private Long id = 1L;
    @NotBlank private String name;
    private boolean pinEnabled = false;
    private String pinCode; // never returned in API responses - see ProfileResponse


    public Profile() {
        // required by JPA
    }

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
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
    public Profile(String name, boolean pinEnabled, String pinCode) {
        this.id = 1L;
        this.name = name;
        this.pinEnabled = pinEnabled;
        this.pinCode = pinCode;
    }

    public Profile(Long id, String name, boolean pinEnabled, String pinCode) {
        this.id = id;
        this.name = name;
        this.pinEnabled = pinEnabled;
        this.pinCode = pinCode;
    }
    
}
