package com.example.bookstorespringapi.controllers;

import com.example.bookstorespringapi.entities.Rental;
import com.example.bookstorespringapi.services.RentalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/rentals")
public class RentalController {

    private final RentalService rentalService;

    @Autowired
    public RentalController(RentalService rentalService) {
        this.rentalService = rentalService;
    }

    @GetMapping
    public List<Rental> getAllRentals() {
        return rentalService.getAllRentals();
    }

    @GetMapping("/{id}")
    public Optional<Rental> getRentalById(@PathVariable int id) {
        return rentalService.getRentalById(id);
    }

    @PostMapping
    public Rental createRental(@RequestBody Rental rental) {
        return rentalService.createRental(rental);
    }

    @PutMapping("/{id}")
    public Rental updateRental(@PathVariable int id, @RequestBody Rental newRentalData) {
        return rentalService.updateRental(id, newRentalData);
    }

    @DeleteMapping("/{id}")
    public void deleteRentalById(@PathVariable int id) {
        rentalService.deleteRentalById(id);
    }
}
