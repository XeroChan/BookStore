import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Paper, Button, Stack, Pagination } from "@mui/material";
import BookForm from "../components/BookForm";
import { handleEditBook as editBookHelper, handleAddBook as addBookHelper } from "../helpers/storePageHelpers";

const AdminSection = ({
  books,
  handleDeleteBook,
  showAddBookForm,
  setShowAddBookForm,
  bookDetails,
  setBookDetails,
  handleAddBook,
  authors,
  theme,
  setBooks,
  rentals,
  clients,
  setRentals
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [rentalSearchQuery, setRentalSearchQuery] = useState("");
  const [filteredRentals, setFilteredRentals] = useState([]);
  const BooksPerPage = 5;
  const RentalsPerPage = 5;

  useEffect(() => {
    const filtered = books.filter((book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredBooks(filtered);
  }, [books, searchQuery]);

  useEffect(() => {
    const filtered = rentals.filter((rental) => {
      const client = clients.find((client) => client.id === rental.clientId);
      const clientName = `${client?.name?.toLowerCase() || ""} ${client?.surname?.toLowerCase() || ""}`;
      return clientName.includes(rentalSearchQuery.toLowerCase());
    });
    setFilteredRentals(filtered);
  }, [rentals, rentalSearchQuery, clients]);

  const startIndex = (currentPage - 1) * BooksPerPage;
  const endIndex = startIndex + BooksPerPage;
  const booksToShow = filteredBooks.slice(startIndex, endIndex);

  const startRentalIndex = (currentPage - 1) * RentalsPerPage;
  const endRentalIndex = startRentalIndex + RentalsPerPage;
  const rentalsToShow = filteredRentals.slice(startRentalIndex, endRentalIndex);

  const handlePageChange = (_event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleEditBookClickInternal = (book) => {
    console.log("Editing Book Details:", book);
    setBookDetails(book);
    setShowAddBookForm(true);
    setIsEditing(true);
  };

  const handleDeleteBookClick = (bookId) => {
    handleDeleteBook(bookId, setRentals, setBooks);
  };

  const getAuthorNameById = (authorId) => {
    const author = authors.find((author) => author.id === authorId);
    return author ? `${author.authorName} ${author.authorSurname}` : "Unknown Author";
  };

  const getClientNameById = (clientId) => {
    const client = clients.find((client) => client.id === clientId);
    return client ? `${client.name} ${client.surname}` : "Unknown Client";
  };

  const getBookTitleById = (bookId) => {
    const book = books.find((book) => book.id === bookId);
    return book ? book.title : "Unknown Book";
  };

  const handleSubmit = (bookDetails, isEditing) => {
    if (isEditing) {
        editBookHelper(bookDetails, setBooks, setShowAddBookForm, setBookDetails);
    } else {
        addBookHelper(bookDetails, setBooks, setShowAddBookForm, setBookDetails);
    }
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
      <TextField
        label="Wyszukaj"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        InputLabelProps={{
          sx: {
            color: "#9bc9db",
          },
        }}
        InputProps={{
          sx: {
            color: "#ffffff",
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#89c7fa",
            },
          },
        }}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tytuł</TableCell>
              <TableCell>Autor</TableCell>
              <TableCell>Wydawca</TableCell>
              <TableCell>Gatunek</TableCell>
              <TableCell>Akcje</TableCell>
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
                  <Button onClick={() => handleEditBookClickInternal(book)}>Edytuj</Button>
                  <Button onClick={() => handleDeleteBookClick(book.id)}>Usuń</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
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
      <br></br>
      <Button
        variant="contained"
        color="primary"
        style={{ margin: '0.5rem', padding: '10px 20px' }}
        onClick={() => {
          setShowAddBookForm(true);
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
        }}
      >
        Dodaj książkę
      </Button>
      {(showAddBookForm || isEditing) && (
        <BookForm
          bookDetails={bookDetails}
          setBookDetails={setBookDetails}
          showAddBookForm={showAddBookForm}
          isEditing={isEditing}
          handleAddBook={(details) => addBookHelper(details, setBooks, setShowAddBookForm, setBookDetails)}
          handleEditBook={(details) => editBookHelper(details, setBooks, setShowAddBookForm, setBookDetails)}
          setShowAddBookForm={setShowAddBookForm}
          authors={authors}
          theme={theme}
          handleCancel={handleCancel}
        />
      )}
      <h2>Wypożyczenia klientów</h2>
      <TextField
        label="Wyszukaj klienta"
        variant="outlined"
        fullWidth
        margin="normal"
        value={rentalSearchQuery}
        onChange={(e) => setRentalSearchQuery(e.target.value)}
        InputLabelProps={{
          sx: {
            color: "#9bc9db",
          },
        }}
        InputProps={{
          sx: {
            color: "#ffffff",
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#89c7fa",
            },
          },
        }}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Klient</TableCell>
              <TableCell>Książka</TableCell>
              <TableCell>Data wypożyczenia</TableCell>
              <TableCell>Data oddania</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rentalsToShow.map((rental) => (
              <TableRow key={rental.id}>
                <TableCell>{getClientNameById(rental.clientId)}</TableCell>
                <TableCell>{getBookTitleById(rental.bookId)}</TableCell>
                <TableCell>{new Date(rental.rentalDate).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(rental.dueDate).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Stack spacing={2} style={{ marginTop: "5vh", textAlign: "center" }}>
        <Pagination
          count={Math.ceil(filteredRentals.length / RentalsPerPage)}
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

export default AdminSection;