import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Stack, Pagination } from "@mui/material";
import BookForm from "../components/BookForm";

const AdminSection = ({
  books,
  handleDeleteBook,
  showAddBookForm,
  setShowAddBookForm,
  bookDetails,
  setBookDetails,
  handleAddBook,
  handleEditBook,
  authors,
  rentals,
  renderClientRentalsAdm,
  theme,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const RentalsPerPage = 5;

  useEffect(() => {
    const filtered = books.filter((book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredBooks(filtered);
  }, [books, searchQuery]);

  const startIndex = (currentPage - 1) * RentalsPerPage;
  const endIndex = startIndex + RentalsPerPage;
  const booksToShow = filteredBooks.slice(startIndex, endIndex);

  const handlePageChange = (_event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleEditBookClickInternal = (book) => {
    setBookDetails(book);
    setShowAddBookForm(true);
    setIsEditing(true);
  };

  const getAuthorNameById = (authorId) => {
    const author = authors.find((author) => author.id === authorId);
    return author ? `${author.authorName} ${author.authorSurname}` : "Unknown Author";
  };

  const handleCancel = () => {
    setShowAddBookForm(false);
    setIsEditing(false);
    setBookDetails({
      id: 0,
      title: '',
      AuthorId: '',
      publisher: '',
      genre: '',
      description: '',
      isbn: '',
      pagesCount: 0,
      price: 0,
      releaseDate: '',
      imageUri: '',
      dateAdded: new Date().toISOString(),
    });
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search books..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>Publisher</TableCell>
              <TableCell>Genre</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {booksToShow.map((book) => (
              <TableRow key={book.id}>
                <TableCell>{book.title}</TableCell>
                <TableCell>{getAuthorNameById(book.authorId)}</TableCell>
                <TableCell>{book.publisher}</TableCell>
                <TableCell>{book.genre}</TableCell>
                <TableCell>
                  <Button onClick={() => handleEditBookClickInternal(book)}>Edit</Button>
                  <Button onClick={() => handleDeleteBook(book.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Stack spacing={2} style={{ marginTop: "5vh", textAlign: "center" }}>
        <Pagination
          count={Math.ceil(filteredBooks.length / RentalsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          variant="outlined"
          color="primary"
          style={{ marginLeft: "auto", marginRight: "auto" }}
        />
      </Stack>
      {(showAddBookForm || isEditing) && (
        <BookForm
          bookDetails={bookDetails}
          setBookDetails={setBookDetails}
          showAddBookForm={showAddBookForm}
          isEditing={isEditing}
          handleAddBook={handleAddBook}
          handleEditBook={handleEditBook}
          setShowAddBookForm={setShowAddBookForm}
          authors={authors}
          theme={theme}
          handleCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default AdminSection;