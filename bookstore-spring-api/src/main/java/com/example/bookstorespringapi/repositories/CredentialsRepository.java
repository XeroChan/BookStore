package com.example.bookstorespringapi.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.bookstorespringapi.entities.Credentials;

@Repository
public interface CredentialsRepository extends JpaRepository<Credentials, Integer> {
    Credentials findByUsername(String username);
    Credentials findByUsernameAndPassword(String username, String password);
}
