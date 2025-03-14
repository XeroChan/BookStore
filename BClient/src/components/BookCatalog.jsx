import React, { useState } from "react";
import { Stack, Pagination } from "@mui/material";
import BookCard from "../components/BookCard";
import BookFilter from "../components/BookFilter";

const BookCatalog = ({ books, onRent, selectedBookId, authors, isAdmin, handleEditBook, onViewDetails }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCriteria, setFilterCriteria] = useState("title");
  const BooksPerPage = 5;

  const filteredBooks = books.filter((book) => {
    const value = book[filterCriteria]?.toLowerCase() || "";
    if (filterCriteria === "author") {
      if (!authors) return false;
      const author = authors.find((author) => author.id === book.authorId);
      const authorName = `${author?.authorName?.toLowerCase() || ""} ${author?.authorSurname?.toLowerCase() || ""}`;
      return authorName.includes(searchQuery.toLowerCase());
    }
    return value.includes(searchQuery.toLowerCase());
  });

  const startIndex = (currentPage - 1) * BooksPerPage;
  const endIndex = startIndex + BooksPerPage;
  const booksToShow = filteredBooks.slice(startIndex, endIndex);

  const handlePageChange = (_event, newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div>
      <BookFilter
        filterCriteria={filterCriteria}
        setFilterCriteria={setFilterCriteria}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "10px",
        }}
      >
        {booksToShow.map((book) => {
          const author = authors.find((author) => author.id === book.authorId);
          return (
            <BookCard
              key={book.id}
              book={book}
              author={author}
              onRent={isAdmin ? null : onRent} // Conditionally render rental functionality
              onViewDetails={onViewDetails}
              selectedBookId={selectedBookId}
              isAdmin={isAdmin}
            />
          );
        })}
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