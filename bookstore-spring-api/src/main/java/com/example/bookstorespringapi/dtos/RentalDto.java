package com.example.bookstorespringapi.dtos;

import jakarta.validation.constraints.NotNull;

import java.util.Date;

public class RentalDto {
    private int clientId;
    private int BookId;
    private Date RentalDate;
    private Date DueDate;

    public RentalDto(int clientId, int BookId, Date RentalDate, Date DueDate) {
        this.clientId = clientId;
        this.BookId = BookId;
        this.RentalDate = RentalDate;
        this.DueDate = DueDate;
    }

    public int getclientId() {
        return clientId;
    }

    public void setclientId(int clientId) {
        this.clientId = clientId;
    }

    public int getBookId() {
        return BookId;
    }

    public void setBookId(int BookId) {
        BookId = BookId;
    }

    public Date getRentalDate() {
        return RentalDate;
    }

    public void setRentalDate(Date rentalDate) {
        RentalDate = rentalDate;
    }

    public Date getDueDate() {
        return DueDate;
    }

    public void setDueDate(Date dueDate) {
        DueDate = dueDate;
    }
}
