import React, { useState, useEffect } from "react";
import {
  AppBar,
  Button,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  ThemeProvider,
  Toolbar,
  Typography,
} from "@mui/material";
import { DateTime } from "luxon";
import { useNavigate } from "react-router-dom";
import { Pagination, Stack } from "@mui/material";
import SearchBar from "../components/SearchBar";
import { theme } from "../components/theme";
import * as api from "../api/data";
import LogoutTimer from "../components/LogoutTimer";

export const StorePage = () => {
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [user, setUser] = useState(null);
  const [clients, setClients] = useState([]);
  const [client, setClient] = useState([]);
  const [isAdmin, setIsAdmin] = useState([]);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [dueDate, setDueDate] = useState("");
  const [showAddBookForm, setShowAddBookForm] = useState(false);
  const [editBook] = useState(null);
  const [bookDetails, setBookDetails] = useState({
    title: "",
    author: "",
    publisher: "",
    genre: "",
    description: "",
    isbn: "",
    pagesCount: "",
    price: "",
    releaseDate: "",
    imageUri: "",
  });
  useEffect(() => {
    // This will run whenever editBook changes
    console.log("bookDetails updated:", bookDetails);
  }, [bookDetails]);

  const [isEditing, setIsEditing] = useState(false);
  useEffect(() => {
    setIsEditing(!showAddBookForm);
  }, [showAddBookForm]);

  useEffect(() => {
    if (selectedBookId) {
      const selectedBook = getBookById(selectedBookId);
      if (selectedBook) {
        setUpdatedBook({ ...updatedBook, id: selectedBookId });
        setShowAddBookForm(true);
      }
    }
  }, [selectedBookId]);

  const [updatedBook, setUpdatedBook] = useState({
    id: 0,
    title: "",
    author: "",
    publisher: "",
    genre: "",
    description: "",
    isbn: "",
    pagesCount: 0,
    price: 0,
    releaseDate: "",
    imageUri: "",
  });

  useEffect(() => {
    // Fetch user info only if user is not already set
    if (!user) {
      api.getUserInfo(setUser);
    }

    // Fetch books and rentals regardless of admin status
    api.fetchBooks(setBooks);
    api.fetchRentals(setRentals);
  }, [user]); // Fetch user info only when user changes

  useEffect(() => {
    // If user is an admin, fetch clients and set admin status
    if (user && user.role === "Admin") {
      console.log(user);
      console.log("User is an admin");
      setIsAdmin(true);
      api.fetchClients(setClients);
    } else {
      console.log(user);
      console.log("User is not an admin");
      setIsAdmin(false);
    }
  }, [user]); // Fetch clients only when user changes

  useEffect(() => {
    // If user is not an admin, fetch client info
    if (!isAdmin && user && user.clientId) {
      console.log("Fetching client info for non-admin user");
      api.fetchClientById(user.clientId, setClient);
    }
  }, [isAdmin, user]);

  // Function to handle the Save Changes button click
  useEffect(() => {
    // This will run whenever editBook changes
    console.log("editBook updated:", updatedBook);
  }, [updatedBook]);

  const formatDate = (dateString) => {
    const date = DateTime.fromISO(dateString);
    return date.toLocaleString(DateTime.DATETIME_FULL);
  };

  function getBookById(bookId) {
    return books.find((book) => book.id === bookId);
  }

  function handleRentBook(bookId) {
    return setSelectedBookId(bookId);
  }

  function handleDueDateChange(event) {
    return setDueDate(event.target.value);
  }
  const handleSnackbarClose = () => {
    setRentalSuccess(false);
  };
  const [rentalSuccess, setRentalSuccess] = useState(false);
  async function handleBookRental() {
    try {
      const token = localStorage.getItem("authToken");
      const currentDate = DateTime.local();
      const formattedRentalDate = currentDate.toISO({
        suppressMilliseconds: true,
      });

      const response = await fetch("http://localhost:5088/rentals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.replace(/"/g, "")}`,
        },
        body: JSON.stringify({
          clientId: user?.clientId,
          bookId: selectedBookId,
          rentalDate: formattedRentalDate,
          dueDate: dueDate,
        }),
      });

      if (response.ok) {
        setRentalSuccess(true);
        setTimeout(() => {
          api.fetchRentals(setRentals);
          setSelectedBookId(null);
        }, 2000);
      } else {
        console.error("Error renting the book:", response.statusText);
      }
    } catch (error) {
      console.error("Error renting the book:", error);
    }
  }

  async function handleAddBook() {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:5088/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.replace(/"/g, "")}`,
        },
        body: JSON.stringify(bookDetails),
      });

      if (response.ok) {
        api.fetchBooks(setBooks);
        setBookDetails({
          title: "",
          author: "",
          publisher: "",
          genre: "",
          description: "",
          isbn: "",
          pagesCount: 0,
          price: 0,
          releaseDate: "",
          imageUri: "",
        });
        setShowAddBookForm(false);
      } else {
        console.error(
          "Error adding the book:",
          response.statusText,
          response.status,
          await response.json()
        );
      }
    } catch (error) {
      console.error("Error adding the book:", error);
    }
  }

  async function handleEditBook() {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `http://localhost:5088/books/${selectedBookId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.replace(/"/g, "")}`,
          },
          body: JSON.stringify(bookDetails),
        }
      );

      if (response.ok) {
        api.fetchBooks(setBooks);
        setUpdatedBook({
          title: "",
          author: "",
          publisher: "",
          genre: "",
          description: "",
          isbn: "",
          pagesCount: 0,
          price: 0,
          releaseDate: "",
          imageUri: "",
        });
      } else {
        console.error("Error editing the book:", response.statusText);
      }
    } catch (error) {
      console.error("Error editing the book:", error);
    }
  }

  function handleEditBookClick(book) {
    setSelectedBookId(book.id);
  }

  async function handleDeleteBook(bookId) {
    try {
      const token = localStorage.getItem("authToken");

      // Fetch all rentals
      const rentalResponse = await fetch("http://localhost:5088/rentals", {
        headers: {
          Authorization: `Bearer ${token.replace(/"/g, "")}`,
        },
      });

      if (rentalResponse.ok) {
        const rentalData = await rentalResponse.json();

        // Filter rentals associated with the book
        const bookRentals = rentalData.filter(
          (rental) => rental.bookId === bookId
        );

        // Delete all rentals associated with the book
        const deleteRentalPromises = bookRentals.map(async (rental) => {
          const deleteRentalResponse = await fetch(
            `http://localhost:5088/rentals/${rental._id}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token.replace(/"/g, "")}`,
              },
            }
          );

          if (!deleteRentalResponse.ok) {
            console.error(
              "Error deleting rental:",
              deleteRentalResponse.statusText
            );
          }
        });

        await Promise.all(deleteRentalPromises);

        // After all rentals are deleted, delete the book itself
        const deleteBookResponse = await fetch(
          `http://localhost:5088/books/${bookId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token.replace(/"/g, "")}`,
            },
          }
        );

        if (deleteBookResponse.ok) {
          // Fetch rentals again after successful deletion
          api.fetchRentals(setRentals);
          api.fetchBooks(setBooks); // You may also want to fetch books again if needed
        } else {
          console.error(
            "Error deleting the book:",
            deleteBookResponse.statusText
          );
        }
      } else {
        console.error("Error fetching rental data:", rentalResponse.statusText);
      }
    } catch (error) {
      console.error("Error deleting the book:", error);
    }
  }

  function handleLogout() {
    // Clear the authentication token from localStorage
    localStorage.removeItem("authToken");
    // Set the user state to null
    setUser(null);
    navigate("/");
  }

  const BooksPerPage = 5; // Number of books to display per page
  const RentalsPerPage = 4;
  const [currentPage, setCurrentPage] = useState(1);
  const [currentRPage, setCurrentRPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBooks, setFilteredBooks] = useState([]);

  useEffect(() => {
    const filtered = books.filter((book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredBooks(filtered);
  }, [books, searchQuery]);

  function renderBookCatalog() {
    // Calculate index range for the current page
    const startIndex = (currentPage - 1) * BooksPerPage;
    const endIndex = startIndex + BooksPerPage;

    // Slice the array of books to display only those for the current page
    const booksToShow = filteredBooks.slice(startIndex, endIndex);

    // Handle page change
    const handlePageChange = (_event, newPage) => {
      setCurrentPage(newPage);
    };

    // Handle search
    const handleSearch = (searchQuery) => {
      setSearchQuery(searchQuery);
      setCurrentPage(1); // Reset current page to 1 after search
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
            <Card key={book.id} style={{ width: "250px" }}>
              <CardMedia
                component="img"
                alt={book.title}
                height="250"
                image={book.imageUri}
                style={{ objectFit: "cover", maxWidth: "100%" }}
              />
              <CardContent>
                <Typography variant="h6">{book.title}</Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  {book.author}
                </Typography>
                <Typography variant="body2">{book.price} zł</Typography>
              </CardContent>
              <CardActions
                style={{ justifyContent: "center", marginTop: "30px" }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    handleRentBook(book.id);
                    console.log(book);
                  }}
                >
                  Wypożycz
                </Button>
              </CardActions>
            </Card>
          ))}
        </div>
        {/* Render pagination controls */}
        <Stack spacing={2} style={{ marginTop: "5vh", textAlign: "center" }}>
          <Pagination
            count={Math.ceil(filteredBooks.length / BooksPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            variant="outlined"
            color="primary"
            style={{ marginLeft: "auto", marginRight: "auto" }} // Center pagination
          />
        </Stack>
      </div>
    );
  }

  function getClients(clientId) {
    const client = clients.find((client) => client.id === clientId);
    return client;
  }

  function renderClientSection() {
    const handleRPageChange = (_event, newPage) => {
      setCurrentRPage(newPage);
    };
    const filteredRentals = rentals.filter((rental) => {
      const userClientId = user?.clientId ? parseInt(user.clientId, 10) : null;
      return rental.clientId === userClientId;
    });

    // Calculate total number of pages based on the filtered rentals
    const totalPages = Math.ceil(filteredRentals.length / RentalsPerPage);

    // Calculate the starting index for the current page
    const startIndex = (currentRPage - 1) * RentalsPerPage;

    // Slice the array of filtered rentals to display only those for the current page
    const rentalsToShow = filteredRentals.slice(
      startIndex,
      startIndex + RentalsPerPage
    );

    return (
      <div>
        <h2>Katalog</h2>
        {renderBookCatalog()}

        {selectedBookId && (
          <div
            style={{ marginTop: "20px", display: "flex", alignItems: "center" }}
          >
            <TextField
              id="due-date"
              label="Data  oddania"
              type="datetime-local"
              value={dueDate}
              onChange={handleDueDateChange}
              InputLabelProps={{
                shrink: true,
              }}
              style={{ marginRight: "10px" }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleBookRental}
            >
              Wypożycz książkę
            </Button>
          </div>
        )}
        {/* Render Snackbar component */}
        {rentalSuccess && (
          <Snackbar
            open={rentalSuccess}
            autoHideDuration={1800}
            onClose={handleSnackbarClose}
            message="Pomyślnie wypożyczono."
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          />
        )}
        {/* Display the list of client rentals */}
        <div style={{ marginTop: "40px" }}>
          <h2>Twoje wypożyczenia</h2>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tytuł</TableCell>
                  <TableCell>Autor</TableCell>
                  <TableCell>Cena</TableCell>
                  <TableCell>Imię</TableCell>
                  <TableCell>Nazwisko</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Data wypożyczenie</TableCell>
                  <TableCell>Data oddania</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rentalsToShow.map((rental) => {
                  const book = getBookById(rental.bookId);

                  return (
                    <TableRow key={rental.id}>
                      <TableCell>{book?.title || "N/A"}</TableCell>
                      <TableCell>{book?.author || "N/A"}</TableCell>
                      <TableCell>{book?.price + " zł" || "N/A"}</TableCell>
                      <TableCell>{client?.name || "N/A"}</TableCell>
                      <TableCell>{client?.surname || "N/A"}</TableCell>
                      <TableCell>{client?.email || "N/A"}</TableCell>
                      <TableCell>
                        {formatDate(rental.rentalDate) || "N/A"}
                      </TableCell>
                      <TableCell>
                        {formatDate(rental.dueDate) || "N/A"}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          {/* Render pagination controls */}
          <Stack spacing={2} style={{ marginTop: "5vh", textAlign: "center" }}>
            <Pagination
              count={totalPages}
              page={currentRPage}
              onChange={handleRPageChange}
              variant="outlined"
              color="primary"
              style={{ marginLeft: "auto", marginRight: "auto" }} // Center pagination
            />
          </Stack>
        </div>
      </div>
    );
  }

  function getClients(clientId) {
    const client = clients.find((client) => client.id === clientId);
    return client;
  }

  function renderAdminSection() {
    const startIndex = (currentPage - 1) * BooksPerPage;
    const endIndex = startIndex + BooksPerPage;
    const booksToShow = filteredBooks.slice(startIndex, endIndex);

    // Handle page change
    const handlePageChange = (_event, newPage) => {
      setCurrentPage(newPage);
    };
    const handleRPageChange = (_event, newPage) => {
      setCurrentRPage(newPage);
    };
    return (
      <div>
        {/* Display existing clients and their rental details */}
        <h3>Klienci i wypożyczenia</h3>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Imię</TableCell>
                <TableCell>Nazwisko</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Book Tytuł</TableCell>
                <TableCell>Book Autor</TableCell>
                <TableCell>Data wypożyczenie</TableCell>
                <TableCell>Data oddania</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{renderClientRentalsAdm()}</TableBody>
          </Table>
        </TableContainer>
        <Stack spacing={2} style={{ marginTop: "5vh", textAlign: "center" }}>
          <Pagination
            count={Math.ceil(rentals.length / RentalsPerPage)}
            page={currentRPage}
            onChange={handleRPageChange}
            variant="outlined"
            color="primary"
            style={{ marginLeft: "auto", marginRight: "auto" }} // Center pagination
          />
        </Stack>
        {(showAddBookForm || editBook) && renderBookForm()}

        {/* Display Existing Books */}
        <h3>Katalog</h3>
        {/* Dodaj książkę Form */}
        {!showAddBookForm && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setShowAddBookForm(true);
              setBookDetails({
                title: "",
                author: "",
                publisher: "",
                genre: "",
                description: "",
                isbn: "",
                pagesCount: 0,
                price: 0,
                releaseDate: "",
                imageUri: "",
              });
            }}
            style={{ marginBottom: "10px" }}
          >
            Dodaj książkę
          </Button>
        )}
        <SearchBar setSearchQuery={setSearchQuery} />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "10px",
          }}
        >
          {booksToShow.map((book) => (
            <Card key={book.id} style={{ width: "250px" }}>
              <CardMedia
                component="img"
                alt={book.title}
                height="250"
                image={book.imageUri}
                style={{ objectFit: "cover", maxWidth: "100%" }}
              />
              <CardContent>
                <Typography variant="h6">{book.title}</Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  {book.author}
                </Typography>
                <Typography variant="body2">{book.price} zł</Typography>
              </CardContent>
              <CardActions
                style={{ justifyContent: "center", marginTop: "10px" }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleEditBookClick(book)}
                >
                  Zmień
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleDeleteBook(book.id)}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          ))}
        </div>
        <Stack spacing={2} style={{ marginTop: "5vh", textAlign: "center" }}>
          <Pagination
            count={Math.ceil(filteredBooks.length / BooksPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            variant="outlined"
            color="primary"
            style={{ marginLeft: "auto", marginRight: "auto" }} // Center pagination
          />
        </Stack>
      </div>
    );
  }

  function renderClientRentalsAdm() {
    const startIndex = (currentRPage - 1) * RentalsPerPage;
    const endIndex = startIndex + RentalsPerPage;
    // Slice the array of rentals to display only those for the current page
    const rentalsToShow = rentals.slice(startIndex, endIndex);

    return rentalsToShow.map((rental) => {
      const book = getBookById(rental.bookId);
      const client = getClients(rental.clientId);

      return (
        <TableRow key={rental.id}>
          <TableCell>{client?.name || "N/A"}</TableCell>
          <TableCell>{client?.surname || "N/A"}</TableCell>
          <TableCell>{client?.email || "N/A"}</TableCell>
          <TableCell>{book?.title || "N/A"}</TableCell>
          <TableCell>{book?.author || "N/A"}</TableCell>
          <TableCell>{rental.rentalDate || "N/A"}</TableCell>
          <TableCell>{rental.dueDate || "N/A"}</TableCell>
        </TableRow>
      );
    });
  }

  function renderBookForm() {
    const handleChange = (e) => {
      setBookDetails((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value,
      }));
    };
    const maxTitleLength = 100;
    const maxAuthorLength = 30;
    const maxPublisherLength = 40;
    const maxGenreLength = 50;
    const maxDescriptionLength = 800;
    const maxISBNLength = 13;
    const minPagesCount = 1;
    const maxPagesCount = 2000;
    const maxPrice = 200;
    const maxUriLength = 250;

    return (
      <ThemeProvider theme={theme}>
        <div>
          <form>
            <TextField
              label="Tytuł"
              name="title"
              variant="outlined"
              fullWidth
              margin="normal"
              value={showAddBookForm ? bookDetails.title : ""}
              onChange={handleChange}
              inputProps={{ maxLength: maxTitleLength }}
              helperText={`Remaining characters: ${
                maxTitleLength - bookDetails.title.length
              }`}
            />
            <TextField
              label="Autor"
              name="author"
              variant="outlined"
              fullWidth
              margin="normal"
              value={showAddBookForm ? bookDetails.author : ""}
              onChange={handleChange}
              inputProps={{ maxLength: maxAuthorLength }}
              helperText={`Remaining characters: ${
                maxAuthorLength - bookDetails.author.length
              }`}
            />
            <TextField
              label="Publisher"
              name="publisher"
              variant="outlined"
              fullWidth
              margin="normal"
              value={showAddBookForm ? bookDetails.publisher : ""}
              onChange={handleChange}
              inputProps={{ maxLength: maxPublisherLength }}
              helperText={`Remaining characters: ${
                maxPublisherLength - bookDetails.publisher.length
              }`}
            />
            <TextField
              label="Genre"
              name="genre"
              variant="outlined"
              fullWidth
              margin="normal"
              value={showAddBookForm ? bookDetails.genre : ""}
              onChange={handleChange}
              inputProps={{ maxLength: maxGenreLength }}
              helperText={`Remaining characters: ${
                maxGenreLength - bookDetails.genre.length
              }`}
            />
            <TextField
              label="Description"
              name="description"
              variant="outlined"
              fullWidth
              margin="normal"
              value={showAddBookForm ? bookDetails.description : ""}
              onChange={handleChange}
              inputProps={{ maxLength: maxDescriptionLength }}
              helperText={`Remaining characters: ${
                maxDescriptionLength - bookDetails.description.length
              }`}
            />
            <TextField
              label="ISBN"
              name="isbn"
              variant="outlined"
              fullWidth
              margin="normal"
              type="text"
              value={showAddBookForm ? bookDetails.isbn : ""}
              onChange={(e) => {
                setBookDetails((prevState) => ({
                  ...prevState,
                  [e.target.name]: e.target.value,
                }));
                const inputValue = e.target.value;
                const numericValue = inputValue.replace(/[^0-9]/g, ""); // Remove non-numeric characters
                const limitedValue = numericValue.slice(0, 13); // Limit to 13 characters
                setBookDetails({ ...bookDetails, isbn: limitedValue });
              }}
              inputProps={{ maxLength: maxISBNLength }}
              helperText={`Remaining characters: ${
                maxISBNLength - bookDetails.isbn.length
              }`}
            />
            <TextField
              label="Pages Count"
              name="pagesCount"
              variant="outlined"
              fullWidth
              margin="normal"
              type="number"
              value={showAddBookForm ? bookDetails.pagesCount : ""}
              onChange={(e) => {
                setBookDetails((prevState) => ({
                  ...prevState,
                  [e.target.name]: e.target.value,
                }));
                const value = parseInt(e.target.value, 10);
                if (!isNaN(value)) {
                  setBookDetails({ ...bookDetails, pagesCount: value });
                }
              }}
              inputProps={{ max: maxPagesCount, min: minPagesCount }}
              helperText={`Minimum Pages Count: ${minPagesCount}. Pages until limit: ${
                maxPagesCount - bookDetails.pagesCount.valueOf()
              }`}
            />

            <TextField
              label="Cena"
              name="price"
              variant="outlined"
              fullWidth
              margin="normal"
              type="number"
              value={showAddBookForm ? bookDetails.price : ""}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                if (!isNaN(value) && value <= maxPrice) {
                  setBookDetails((prevState) => ({
                    ...prevState,
                    [e.target.name]: value,
                  }));
                }
              }}
              inputProps={{ max: maxPrice }}
              helperText={`Remaining value before reaching maximum price: ${
                maxPrice - bookDetails.price.valueOf()
              }`}
            />

            <TextField
              label="Release Date"
              name="releaseDate"
              variant="outlined"
              fullWidth
              margin="normal"
              type="date"
              value={showAddBookForm ? bookDetails.releaseDate : ""}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              label="ImageUri"
              name="imageUri"
              variant="outlined"
              fullWidth
              margin="normal"
              value={showAddBookForm ? bookDetails.imageUri : ""}
              onChange={handleChange}
              inputProps={{ maxLength: maxUriLength }}
              helperText={`Remaining characters: ${
                maxUriLength - bookDetails.imageUri.length
              }`}
            />
            {/* Buttons */}
            <Button
              variant="contained"
              color="primary"
              onClick={isEditing ? handleEditBook : handleAddBook}
              style={{ marginRight: "10px" }}
            >
              {isEditing ? "Save Changes" : "Dodaj książkę"}
            </Button>

            {/* Button to cancel adding or editing book */}
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => {
                setShowAddBookForm(false);
                setBookDetails({
                  id: 0,
                  title: "",
                  author: "",
                  publisher: "",
                  genre: "",
                  description: "",
                  isbn: "",
                  pagesCount: 0,
                  price: 0,
                  releaseDate: "",
                  imageUri: "",
                });
              }}
            >
              Anuluj
            </Button>
          </form>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <div style={{ width: "100%", maxWidth: "1200px", margin: "0 auto" }}>
        {/* AppBar with timer */}
        <AppBar position="sticky" style={{ backgroundColor: "#1976D2" }}>
          <Toolbar>
            {user && <Typography variant="h6">Witaj, {user.sub}!</Typography>}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
              }}
            >
              <LogoutTimer onTimeout={handleLogout} />
            </div>

            {user && (
              <div style={{ marginLeft: "auto" }}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleLogout}
                >
                  Wyloguj się
                </Button>
              </div>
            )}
          </Toolbar>
        </AppBar>

        {/* Main content */}
        <div>
          <h1>Księgarnia</h1>
          {/* Display user information */}
          {isAdmin ? renderAdminSection() : renderClientSection()}
        </div>
      </div>
    </ThemeProvider>
  );
};
