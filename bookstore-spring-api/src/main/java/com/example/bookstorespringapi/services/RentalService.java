package com.example.bookstorespringapi.services;

import com.example.bookstorespringapi.entities.Rental;
import com.example.bookstorespringapi.repositories.RentalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RentalService {

    private final RentalRepository rentalRepository;

    @Autowired
    public RentalService(RentalRepository rentalRepository) {
        this.rentalRepository = rentalRepository;
    }

    public List<Rental> getAllRentals() {
        return rentalRepository.findAll();
    }

    public Optional<Rental> getRentalById(int id) {
        return rentalRepository.findById(id);
    }

    public Rental createRental(Rental rental) {
        return rentalRepository.save(rental);
    }

    public Rental updateRental(int id, Rental newRentalData) {
        Optional<Rental> optionalRental = rentalRepository.findById(id);
        if (optionalRental.isPresent()) {
            Rental existingRental = optionalRental.get();
            existingRental.setclientId(newRentalData.getclientId());
            existingRental.setBookId(newRentalData.getBookId());
            existingRental.setRentalDate(newRentalData.getRentalDate());
            existingRental.setDueDate(newRentalData.getDueDate());
            return rentalRepository.save(existingRental);
        } else {
            // Handle the case when the rental with the given id doesn't exist
            // You can throw an exception, return null, or handle it differently based on your use case
            return null;
        }
    }

    public void deleteRentalById(int id) {
        rentalRepository.deleteById(id);
    }
}
