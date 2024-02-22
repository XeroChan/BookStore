package com.example.bookstorespringapi.services;

import com.example.bookstorespringapi.entities.Credentials;
import com.example.bookstorespringapi.repositories.CredentialsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CredentialsService {

    private final CredentialsRepository credentialRepository;

    @Autowired
    public CredentialsService(CredentialsRepository credentialRepository) {
        this.credentialRepository = credentialRepository;
    }

    public List<Credentials> getAllCredentials() {
        return credentialRepository.findAll();
    }

    public Optional<Credentials> getCredentialsById(int id) {
        return credentialRepository.findById(id);
    }

    public Credentials createCredentials(Credentials credential) {
        return credentialRepository.save(credential);
    }

    public Credentials updateCredentials(int id, Credentials newCredentialsData) {
        Optional<Credentials> optionalCredentials = credentialRepository.findById(id);
        if (optionalCredentials.isPresent()) {
            Credentials existingCredentials = optionalCredentials.get();
            existingCredentials.setClientId(newCredentialsData.getClientId());
            existingCredentials.setUsername(newCredentialsData.getUsername());
            existingCredentials.setPassword(newCredentialsData.getPassword());
            existingCredentials.setAdmin(newCredentialsData.isAdmin());
            return credentialRepository.save(existingCredentials);
        } else {
            // Handle the case when the credential with the given id doesn't exist
            // You can throw an exception, return null, or handle it differently based on your use case
            return null;
        }
    }

    public void deleteCredentialsById(int id) {
        credentialRepository.deleteById(id);
    }

    public Credentials authenticate(String username, String password) {
        return credentialRepository.findByUsernameAndPassword(username, password);
    }
}
