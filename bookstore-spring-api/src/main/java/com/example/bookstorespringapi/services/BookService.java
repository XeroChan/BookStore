package com.example.bookstorespringapi.services;

import com.example.bookstorespringapi.entities.Book;
import com.example.bookstorespringapi.repositories.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class BookService {

    private final BookRepository bookRepository;

    @Autowired
    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    public Optional<Book> getBookById(int id) {
        return bookRepository.findById(id);
    }

    public Book createBook(Book book) {
        return bookRepository.save(book);
    }

    public Book updateBook(int id, Book newBookData) {
        Optional<Book> optionalBook = bookRepository.findById(id);
        if (optionalBook.isPresent()) {
            Book existingBook = optionalBook.get();
            if (!Objects.equals(newBookData.getTitle(), "")) existingBook.setTitle(newBookData.getTitle());
            if (!Objects.equals(newBookData.getAuthor(), "")) existingBook.setAuthor(newBookData.getAuthor());
            if (!Objects.equals(newBookData.getPublisher(), "")) existingBook.setPublisher(newBookData.getPublisher());
            if (!Objects.equals(newBookData.getGenre(), "")) existingBook.setGenre(newBookData.getGenre());
            if (!Objects.equals(newBookData.getDescription(), "")) existingBook.setDescription(newBookData.getDescription());
            if (!Objects.equals(newBookData.getIsbn(), "")) existingBook.setIsbn(newBookData.getIsbn());
            if (newBookData.getPagesCount()!=0) existingBook.setPagesCount(newBookData.getPagesCount());
            if (newBookData.getPrice().floatValue()!=0) existingBook.setPrice(newBookData.getPrice());
            if (newBookData.getReleaseDate() != null) existingBook.setReleaseDate(newBookData.getReleaseDate());
            if (!Objects.equals(newBookData.getImageUri(), "")) existingBook.setImageUri(newBookData.getImageUri());

            return bookRepository.save(existingBook);
        } else {
            return null;
        }
    }

    public void deleteBookById(int id) {
        bookRepository.deleteById(id);
    }
}