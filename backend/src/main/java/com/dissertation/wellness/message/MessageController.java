package com.dissertation.wellness.message;
import java.util.List;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.dissertation.wellness.contact.Contact;
import com.dissertation.wellness.contact.ContactRepository;


@RestController
@RequestMapping("/api/messages")
public class MessageController {
    private final MessageRepository messageRepository;
    private final ContactRepository contactRepository;
    
    public MessageController(MessageRepository messageRepository,
                             ContactRepository contactRepository) {
        this.messageRepository = messageRepository;
        this.contactRepository = contactRepository;
    }

    @GetMapping
    public List<Message> getAll() {
        return messageRepository.findAllByOrderBySentAtDesc();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Message create(@Valid @RequestBody MessageRequest request) {
        Contact contact = contactRepository.findById(request.getContactId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unknown contactId"));
        return messageRepository.save(new Message(contact.getId(), contact.getName(), request.getText()));
    }
}