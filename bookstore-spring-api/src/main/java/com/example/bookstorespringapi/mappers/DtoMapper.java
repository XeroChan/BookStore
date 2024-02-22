package com.example.bookstorespringapi.mappers;

import com.example.bookstorespringapi.dtos.*;
import com.example.bookstorespringapi.entities.*;
import org.springframework.stereotype.Component;

@Component
public class DtoMapper {

    public BookDto toDto(Book book) {
        return new BookDto(
                book.getTitle(),
                book.getAuthor(),
                book.getPublisher(),
                book.getGenre(),
                book.getDescription(),
                book.getIsbn(),
                book.getPagesCount(),
                book.getPrice(),
                book.getReleaseDate(),
                book.getImageUri()
        );
    }

    public ClientDto toDto(Client client) {
        return new ClientDto(
                client.getName(),
                client.getSurname(),
                client.getEmail(),
                client.getTelephone()
        );
    }

    public CredentialsDto toDto(Credentials credential) {
        return new CredentialsDto(
                credential.getClientId(),
                credential.getUsername(),
                credential.getPassword(),
                credential.isAdmin()
        );
    }

    public RentalDto toDto(Rental rental) {
        return new RentalDto(
                rental.getclientId(),
                rental.getBookId(),
                rental.getRentalDate(),
                rental.getDueDate()
        );
    }

    public Book toEntity(BookDto bookDto) {
        return new Book(
                bookDto.getTitle(),
                bookDto.getAuthor(),
                bookDto.getPublisher(),
                bookDto.getGenre(),
                bookDto.getDescription(),
                bookDto.getIsbn(),
                bookDto.getPagesCount(),
                bookDto.getPrice(),
                bookDto.getReleaseDate(),
                bookDto.getImageUri()
        );
    }
}
