package com.example.bookstorespringapi.dtos;

import java.math.BigDecimal;
import java.util.Date;

public class BookDtoV2 {
    private int id;
    private String title;
    private String author;
    private String publisher;
    private String genre;
    private String description;
    private String isbn;
    private int pagesCount;
    private BigDecimal price;
    private Date releaseDate;
    private String imageUri;

    public BookDtoV2(int id, String title, String author, String publisher, String genre, String description, String isbn, int pagesCount, BigDecimal price, Date releaseDate, String imageUri) {
        this.id = id;
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
        return price;
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
