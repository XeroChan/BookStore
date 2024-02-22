package com.example.bookstorespringapi.controllers;

import com.example.bookstorespringapi.entities.Credentials;
import com.example.bookstorespringapi.services.CredentialsService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.crypto.SecretKey;
import java.util.Date;

@RestController
public class LoginController {

    private final CredentialsService credentialService;

    @Autowired
    public LoginController(CredentialsService credentialService) {
        this.credentialService = credentialService;
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody Credentials credential) {
        // Attempt to find a matching user by username and password
        Credentials foundCredentials = credentialService.authenticate(credential.getUsername(), credential.getPassword());

        if (foundCredentials != null) {
            // If user is found, fetch isAdmin flag
            boolean isAdmin = foundCredentials.isAdmin();
            int clientId = foundCredentials.getClientId(); // Get the client ID

            // Generate JWT token with isAdmin flag and client ID
            String token = generateToken(foundCredentials.getUsername(), isAdmin, clientId);
            return ResponseEntity.ok(token);
        } else {
            // If user is not found, return unauthorized status
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Login failed. No matching user found.");
        }
    }


    private String generateToken(String username, boolean isAdmin, int clientId) {
        long currentTimeMillis = System.currentTimeMillis();
        long expirationMillis = currentTimeMillis + (24 * 60 * 60 * 1000); // Token expires in 24 hours
        SecretKey key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
        Claims claims = Jwts.claims().setSubject(username);
        claims.put("role", isAdmin ? "Admin" : "Client"); // Set role claim based on isAdmin flag
        claims.put("clientId", clientId); // Include client ID in the token claims

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(new Date(currentTimeMillis))
                .setExpiration(new Date(expirationMillis))
                .signWith(key)
                .compact();
    }

}
