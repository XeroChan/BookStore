package com.example.bookstorespringapi.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.bookstorespringapi.entities.Rental;

@Repository
public interface RentalRepository extends JpaRepository<Rental, Integer> {

}
