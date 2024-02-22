package com.example.bookstorespringapi.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.bookstorespringapi.entities.Book;

@Repository
public interface BookRepository extends JpaRepository<Book, Integer> {

}
