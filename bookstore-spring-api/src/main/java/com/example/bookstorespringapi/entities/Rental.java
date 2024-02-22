package com.example.bookstorespringapi.entities;

import jakarta.validation.constraints.NotNull;
import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "Rentals")
public class Rental {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @NotNull
    @Column(name ="client_id")
    private int clientId;

    @NotNull
    @Column(name ="book_id")
    private int BookId;

    private Date rentalDate;

    private Date dueDate;

    // Navigation properties
    @ManyToOne
    @JoinColumn(name ="client_id", insertable = false, updatable = false)
    private Client client;

    @ManyToOne
    @JoinColumn(name ="book_id",insertable = false, updatable = false)
    private Book book;

    // Getters and setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
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
        this.BookId = BookId;
    }

    public Date getRentalDate() {
        return rentalDate;
    }

    public void setRentalDate(Date rentalDate) {
        this.rentalDate = rentalDate;
    }

    public Date getDueDate() {
        return dueDate;
    }

    public void setDueDate(Date dueDate) {
        this.dueDate = dueDate;
    }

    public Client getClient() {
        return client;
    }

    public void setClient(Client client) {
        this.client = client;
    }

    public Book getBook() {
        return book;
    }

    public void setBook(Book book) {
        this.book = book;
    }
}
