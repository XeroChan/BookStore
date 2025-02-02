import React, { useState } from "react";
import { Stack, Pagination } from "@mui/material";
import BookCard from "../components/BookCard";
import SearchBar from "../components/SearchBar";

const BookCatalog = ({ books }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const BooksPerPage = 5;

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const startIndex = (currentPage - 1) * BooksPerPage;
  const endIndex = startIndex + BooksPerPage;
  const booksToShow = filteredBooks.slice(startIndex, endIndex);

  const handlePageChange = (_event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleSearch = (searchQuery) => {
    setSearchQuery(searchQuery);
    setCurrentPage(1);
  };

  return (
    <div>
      <SearchBar setSearchQuery={handleSearch} />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "10px",
        }}
      >
        {booksToShow.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
      <Stack spacing={2} style={{ marginTop: "5vh", textAlign: "center" }}>
        <Pagination
          count={Math.ceil(filteredBooks.length / BooksPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          variant="outlined"
          color="primary"
          style={{ marginLeft: "auto", marginRight: "auto" }}
        />
      </Stack>
    </div>
  );
};

export default BookCatalog;