package com.example.bookstorespringapi.entities;

import jakarta.validation.constraints.*;
import jakarta.persistence.*;
import org.hibernate.validator.constraints.URL;

import java.math.BigDecimal;
import java.util.Date;


@Entity
@Table(name = "Books")
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @NotBlank
    @Size(max = 100)
    private String title;

    @NotBlank
    @Size(max = 30)
    private String author;

    @NotBlank
    @Size(max = 40)
    private String publisher;

    @NotBlank
    @Size(max = 50)
    private String genre;

    @NotBlank
    @Size(max = 800)
    private String description;

    @NotBlank
    @Size(max = 13)
    private String isbn;

    @Min(1)
    @Max(2000)
    @Column(name = "pages_count")
    private int pagesCount;

    @DecimalMin("1.0")
    @DecimalMax("200.0")
    private BigDecimal price;

    @Temporal(TemporalType.DATE)
    @Column(name = "release_date")
    private Date releaseDate;

    @URL
    @Size(max = 250)
    @Column(name = "image_uri")
    private String imageUri;

    public Book(String title, String author, String publisher, String genre,
                String description, String isbn, int pagesCount, BigDecimal price,
                Date releaseDate, String imageUri) {
        this.title = title;
        this.author = author;
        this.publisher = publisher;
        this.genre = genre;
        this.description = description;
        this.isbn = isbn;
        this.pagesCount = pagesCount;
        this.price = price;
        this.releaseDate = releaseDate;
        this.imageUri = imageUri;
    }

    public Book() {

    }


    // Getters and setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getPublisher() {
        return publisher;
    }

    public void setPublisher(String publisher) {
        this.publisher = publisher;
    }

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getIsbn() {
        return isbn;
    }

    public void setIsbn(String isbn) {
        this.isbn = isbn;
    }

    public int getPagesCount() {
        return pagesCount;
    }

    public void setPagesCount(int pagesCount) {
        this.pagesCount = pagesCount;
    }

    public BigDecimal getPrice() {
        return price != null ? price : BigDecimal.ZERO;
    }


    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Date getReleaseDate() {
        return releaseDate;
    }

    public void setReleaseDate(Date releaseDate) {
        this.releaseDate = releaseDate;
    }

    public String getImageUri() {
        return imageUri;
    }

    public void setImageUri(String imageUri) {
        this.imageUri = imageUri;
    }
}
