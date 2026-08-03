package com.dissertation.wellness.message;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;

public class MessageRequest {
    @NotNull private Long contactId;
    @NotBlank private String text;

    public Long getContactId() {
        return contactId;
    }
    public void setContactId(Long contactId) {
        this.contactId = contactId;
    }
    public String getText() {
        return text;
    }
    public void setText(String text) {
        this.text = text;
    }
    
}
