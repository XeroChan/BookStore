import React, { useState, useEffect } from "react";
import {
  AppBar,
  Button,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
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
import BookCard from "../components/BookCard";
import RentalDatePicker from "../components/RentalDatePicker";
import RentalSnackbar from "../components/RentalSnackbar";
import ClientRentals from "../components/ClientRentals";
import BookForm from "../components/BookForm";
import AuthorsTable from '../components/AuthorsTable';
import ConfirmationDialog from '../components/ConfirmationDialog';

export const StorePage = () => {
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [user, setUser] = useState(null);
  const [clients, setClients] = useState([]);
  const [client, setClient] = useState([]);
  const [isAdmin, setIsAdmin] = useState([]);
  const [comments, setComments] = useState([]);
  const [allComments, setAllComments] = useState([]);
  const [bookTitles, setBookTitles] = useState({});
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(0);
  const [open, setOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [dueDate, setDueDate] = useState("");
  const [showAddBookForm, setShowAddBookForm] = useState(false);
  const [editBook] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [bookDetails, setBookDetails] = useState({
    title: "",
    author_id: 0,
    publisher: "",
    genre: "",
    description: "",
    isbn: "",
    pagesCount: 0,
    price: 0,
    releaseDate: "",
    imageUri: "",
    dateAdded: new Date().toISOString(),
  });
  const [newPublications, setNewPublications] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loggedInUserId, setLoggedInUserId] = useState("");

  useEffect(() => {
    const loadComments = async () => {
      const commentsData = await api.fetchAllCommentsWithUsernames();
      setAllComments(commentsData);
      console.log("Comments:", commentsData); // Log the fetched comments
    };
    loadComments();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const authorsData = await api.fetchAuthors();
      setAuthors(authorsData);
      if (user) {
        const subscriptionsData = await api.fetchSubscriptionsForUser(
          user.clientId
        );
        setSubscriptions(subscriptionsData);
      }
    };

    fetchData();
  }, [user]);

  const handleSubscribeToAuthor = async (authorId) => {
    if (user) {
      await api.subscribeToAuthor(user.clientId, authorId);
      // Refresh new publications
      api.fetchNewPublicationsForUser(user.clientId).then(setNewPublications);
      // Refresh subscriptions
      const subscriptionsData = await api.fetchSubscriptionsForUser(
        user.clientId
      );
      setSubscriptions(subscriptionsData);
    } else {
      console.error("User is not logged in");
    }
  };

  const handleUnsubscribeFromAuthor = async () => {
    if (selectedSubscription) {
      console.log("Unsubscribing from author:", selectedSubscription);
      await api.unsubscribeFromAuthor(selectedSubscription);
      // Refresh subscriptions
      const subscriptionsData = await api.fetchSubscriptionsForUser(user.clientId);
      setSubscriptions(subscriptionsData);
      setOpenDialog(false);
    }
  };

  const getSubscriptionId = (authorId) => {
    const subscription = subscriptions.find(subscription => subscription.authorId === authorId);
    return subscription ? subscription.id : null;
  };

  const isSubscribed = (authorId) => {
    return subscriptions.some(
      (subscription) => subscription.authorId === authorId
    );
  };

  const handleOpenDialog = (subscription) => {
    setSelectedSubscription(subscription);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedSubscription(null);
  };

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
    author_id: "",
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
    if (user) {
      api.fetchUserComments(user.clientId, async (comments) => {
        setComments(comments);
        const titles = {};
        for (const comment of comments) {
          const bookDetails = await api.fetchBookDetails(comment.bookId);
          if (bookDetails) {
            titles[comment.bookId] = bookDetails.title;
          }
        }
        setBookTitles(titles);
      });
      api.fetchNewPublicationsForUser(user.clientId).then(setNewPublications);
      api.fetchAuthors().then(setAuthors);
    }
  }, [user]);

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

  const handlePostComment = async () => {
    if (selectedBookId && newComment && newRating >= 0 && newRating <= 5) {
      await api.postComment(
        user.clientId,
        selectedBookId,
        newComment,
        newRating
      );
      
      // Refresh comments
      api.fetchUserComments(user.clientId, async (comments) => {
        setComments(comments);
        const titles = { ...bookTitles };
        for (const comment of comments) {
          if (!titles[comment.bookId]) {
            const bookDetails = await api.fetchBookDetails(comment.bookId);
            if (bookDetails) {
              titles[comment.bookId] = bookDetails.title;
            }
          }
        }
        setBookTitles(titles);
      });
      // refresh all comments
      const loadComments = async () => {
        const commentsData = await api.fetchAllCommentsWithUsernames();
        setAllComments(commentsData);
        console.log("Comments:", commentsData); // Log the fetched comments
      };
      loadComments();
      setNewComment("");
      setNewRating(0);
      setSelectedBookId("");
      }
  };

  const handleDeleteComment = async (commentId) => {
    await api.deleteComment(commentId);
    // Refresh comments
    api.fetchUserComments(user.clientId, async (comments) => {
      setComments(comments);
      const titles = { ...bookTitles };
      for (const comment of comments) {
        if (!titles[comment.bookId]) {
          const bookDetails = await api.fetchBookDetails(comment.bookId);
          if (bookDetails) {
            titles[comment.bookId] = bookDetails.title;
          }
        }
      }
      setBookTitles(titles);
    });
  };

  const handleOpenReviews = async (bookId) => {
    const bookReviews = await fetchBookReviews(bookId); // Fetch reviews for the book
    setReviews(bookReviews);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
      const bookDetailsWithDate = {
        ...bookDetails,
        dateAdded: new Date().toISOString(), // Set current date and time before sending
        
      };
      console.log('Book details before sending to backend:', bookDetailsWithDate); // Debugging line
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
          author_id: 0,
          publisher: "",
          genre: "",
          description: "",
          isbn: "",
          pagesCount: 0,
          price: 0,
          releaseDate: "",
          imageUri: "",
          dateAdded: new Date().toISOString(), // Reset with current date and time
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
          author_id: 0,
          publisher: "",
          genre: "",
          description: "",
          isbn: "",
          pagesCount: 0,
          price: 0,
          releaseDate: "",
          imageUri: "",
          dateAdded: new Date().toISOString(),
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
            <BookCard
              key={book.id}
              book={book}
              onRent={handleRentBook} // Przekazujemy funkcję do obsługi wypożyczenia
            />
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
    // Debug statements
  console.log('rentalsToShow:', rentalsToShow);
  console.log('getBookById:', getBookById);
  console.log('client:', client);
  console.log('formatDate:', formatDate);
  console.log('authors:', authors);
    return (
      <div>
        <h2>Katalog</h2>
        {renderBookCatalog()}

        {selectedBookId && (
          <RentalDatePicker
            dueDate={dueDate}
            handleDueDateChange={handleDueDateChange}
            handleBookRental={handleBookRental}
          />
        )}

        <RentalSnackbar
          rentalSuccess={rentalSuccess}
          handleSnackbarClose={handleSnackbarClose}
        />

        {/* Display the list of client rentals */}
        <div style={{ marginTop: "40px" }}>
          <h2>Twoje wypożyczenia</h2>
          
          <ClientRentals
            rentalsToShow={rentalsToShow}
            getBookById={getBookById}
            client={client}
            formatDate={formatDate}
            authors={authors}
          />

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
        {(showAddBookForm || editBook) && (
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
          />
        )}

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
                author_id: 0,
                publisher: "",
                genre: "",
                description: "",
                isbn: "",
                pagesCount: 0,
                price: 0,
                releaseDate: "",
                imageUri: "",
                dateAdded: new Date().toISOString(),
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
      const author = authors.find(author => author.id === book?.authorId);
      const client = getClients(rental.clientId);

      return (
        <TableRow key={rental.id}>
          <TableCell>{client?.name || "N/A"}</TableCell>
          <TableCell>{client?.surname || "N/A"}</TableCell>
          <TableCell>{client?.email || "N/A"}</TableCell>
          <TableCell>{book?.title || "N/A"}</TableCell>
          <TableCell>{author ? `${author.authorName} ${author.authorSurname}` : "N/A"}</TableCell>
          <TableCell>{formatDate(rental.rentalDate) || "N/A"}</TableCell>
          <TableCell>{formatDate(rental.dueDate) || "N/A"}</TableCell>
        </TableRow>
      );
    });
  }

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
  />;

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <LogoutTimer onTimeout={handleLogout} />
          {user && (
            <div style={{ marginLeft: "auto" }}>
              <p>Witaj, {user.sub}!</p> {/* Display sub as username */}
              <Button
                variant="contained"
                color="secondary"
                onClick={handleLogout}
              >
                Wyloguj się
              </Button>
            </div>
          )}
          <Button
            color="inherit"
            onClick={() => {
              console.log("Navigating with user:", user); // Add this log
              navigate("/userpage", { state: { user } });
            }}
          >
            Moje Subskrypcje
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main content */}
      <div>
        <h1>Księgarnia</h1>
        {/* Display user information */}
        <h3>Nowe Publikacje Ulubionych Twórców</h3>
        <ul>
          {newPublications.map((publication) => (
            <li key={publication.id}>
              <strong>{publication.title}</strong> by {publication.author}
            </li>
          ))}
        </ul>
        {isAdmin ? renderAdminSection() : renderClientSection()}
        <h3>Lista Twórców</h3>
        <AuthorsTable
        authors={authors}
        getSubscriptionId={getSubscriptionId}
        handleSubscribeToAuthor={handleSubscribeToAuthor}
        handleOpenDialog={handleOpenDialog}
      />
      <ConfirmationDialog
        open={openDialog}
        handleClose={handleCloseDialog}
        handleConfirm={handleUnsubscribeFromAuthor}
      />
        {user && (
          <div>
            <h3>Dodaj Komentarz</h3>
            <TextField
              label="Komentarz"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              fullWidth
            />
            <TextField
              label="Ocena"
              type="number"
              value={newRating}
              onChange={(e) => setNewRating(Number(e.target.value))}
              inputProps={{ min: 0, max: 5 }}
              fullWidth
            />
            <Select
              value={selectedBookId}
              onChange={(e) => setSelectedBookId(e.target.value)}
              fullWidth
            >
              {books.map((book) => (
                <MenuItem key={book.id} value={book.id}>
                  {book.title}
                </MenuItem>
              ))}
            </Select>
            <Button
              variant="contained"
              color="primary"
              onClick={handlePostComment}
            >
              Dodaj Komentarz
            </Button>

            <h3>All Comments</h3>
            <ul>
            {allComments.map((comment) => (
              <li key={comment.Id}>
                <strong>{comment.username}</strong> commented: {comment.commentString} on
                <strong> {bookTitles[comment.bookId] || "Loading..."}</strong>{" "} scoring {comment.rating}/5
              </li>
            ))}
          </ul>
          </div>
        )}
      </div>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Recenzje</DialogTitle>
        <DialogContent>
          <ul>
            {reviews.map((review) => (
              <li key={review.id}>
                <strong>{review.user}</strong>: {review.commentString} (Ocena:{" "}
                {review.rating}/5)
              </li>
            ))}
          </ul>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Zamknij
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
