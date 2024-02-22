package com.example.bookstorespringapi.controllers;

import com.example.bookstorespringapi.entities.Credentials;
import com.example.bookstorespringapi.services.CredentialsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/credentials")
public class CredentialsController {

    private final CredentialsService credentialService;

    @Autowired
    public CredentialsController(CredentialsService credentialService) {
        this.credentialService = credentialService;
    }

    @GetMapping
    public List<Credentials> getAllCredentials() {
        return credentialService.getAllCredentials();
    }

    @GetMapping("/{id}")
    public Optional<Credentials> getCredentialsById(@PathVariable int id) {
        return credentialService.getCredentialsById(id);
    }

    @PostMapping
    public Credentials createCredentials(@RequestBody Credentials credential) {
        return credentialService.createCredentials(credential);
    }

    @PutMapping("/{id}")
    public Credentials updateCredentials(@PathVariable int id, @RequestBody Credentials newCredentialsData) {
        return credentialService.updateCredentials(id, newCredentialsData);
    }

    @DeleteMapping("/{id}")
    public void deleteCredentialsById(@PathVariable int id) {
        credentialService.deleteCredentialsById(id);
    }
}
