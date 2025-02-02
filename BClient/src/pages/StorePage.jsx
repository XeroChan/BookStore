import React, { useState, useEffect, useRef } from "react";
import {
  AppBar,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
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
import CommentsSection from "../components/CommentsSection";
import BookCatalog from "../components/BookCatalog";
import AdminSection from "../components/AdminSection";
import ClientSection from "../components/ClientSection";

export const StorePage = ({ isAuthenticated, user, setUser }) => {
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [rentals, setRentals] = useState([]);
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
  const [selectedBookId, setSelectedBookId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [showAddBookForm, setShowAddBookForm] = useState(false);
  const [editBook] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState("");
  const [bookDetails, setBookDetails] = useState({
    title: "",
    AuthorId: 0,
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
  const [credentialId, setCredentialId] = useState("");

  const bookTitlesRef = useRef({});

  useEffect(() => {
    const fetchBooksAndTitles = async () => {
      await api.fetchBooks(setBooks);
      const titles = {};
      books.forEach((book) => {
        titles[book.id] = book.title;
      });
      bookTitlesRef.current = titles;
      setBookTitles(titles);
    };
    fetchBooksAndTitles();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const commentsData = await api.fetchAllCommentsWithUsernames();
      setAllComments(commentsData);

      const titles = { ...bookTitlesRef.current };
      for (const comment of commentsData) {
        if (!titles[comment.bookId]) {
          const bookDetails = await api.fetchBookDetails(comment.bookId);
          if (bookDetails) {
            titles[comment.bookId] = bookDetails.title;
          }
        }
      }
      bookTitlesRef.current = titles;
      setBookTitles(titles);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {

      const authorsData = await api.fetchAuthors();
      setAuthors(authorsData);
      if (user) {
        console.log("User clientId:", user.clientId);
        const subscriptionsData = await api.fetchSubscriptionsForUser(
          user.clientId
        );
        setSubscriptions(subscriptionsData);
        const credentialId = await api.fetchCredentialIdByClientId(user.clientId);
        console.log("Fetched CredentialId:", credentialId); // Debugging log
        setCredentialId(credentialId);
      }
    };
    fetchData();
  }, [user]);

  

  const loadNewPublications = async () => {
    if (credentialId) {
      const newPublicationsData = await api.fetchNewPublicationsForSubscribedAuthors(credentialId);

      const authorsData = await api.fetchAuthors();

      const authorsMap = authorsData.reduce((map, author) => {
        map[author.id] = `${author.authorName} ${author.authorSurname}`;
        return map;
      }, {});

      const publicationsWithAuthors = newPublicationsData.map((publication) => ({
        ...publication,
        authorName: authorsMap[publication.authorId] || 'Unknown Author',
      }));
      setNewPublications(publicationsWithAuthors);
    }
  };

  useEffect(() => {
    loadNewPublications();
  }, [credentialId]);

  const handleSubscribeToAuthor = async (authorId) => {
    if (user) {
      await api.subscribeToAuthor(user.clientId, authorId);
      // Refresh new publications
      const newPublicationsData = await api.fetchNewPublicationsForSubscribedAuthors(credentialId);
      setNewPublications(newPublicationsData);
      loadNewPublications();
      // Refresh subscriptions
      const subscriptionsData = await api.fetchSubscriptionsForUser(user.clientId);
      setSubscriptions(subscriptionsData);
    } else {
      console.error("User is not logged in");
    }
  };

  const handleUnsubscribeFromAuthor = async () => {
    if (selectedSubscription) {
      await api.unsubscribeFromAuthor(selectedSubscription);
      // Refresh subscriptions
      const subscriptionsData = await api.fetchSubscriptionsForUser(user.clientId);
      setSubscriptions(subscriptionsData);
      setOpenDialog(false);
      loadNewPublications();
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
    setSelectedSubscription("");
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
    AuthorId: "",
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
    }
  }, [user]);
  
  useEffect(() => {
    if (credentialId) {
      api.fetchNewPublicationsForSubscribedAuthors(credentialId).then(setNewPublications);
      api.fetchAuthors().then(setAuthors);
    }
  }, [credentialId]);

  useEffect(() => {
    // If user is an admin, fetch clients and set admin status
    if (user && user.role === "Admin") {
      setIsAdmin(true);
      api.fetchClients(setClients);
    } else {
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
          setSelectedBookId("");
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
        body: JSON.stringify(bookDetailsWithDate),
      });

      if (response.ok) {
        api.fetchBooks(setBooks);
        setBookDetails({
          title: "",
          AuthorId: 0,
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
    setUser("");
    navigate("/");
  }


  function getClients(clientId) {
    const client = clients.find((client) => client.id === clientId);
    return client;
  }

  function getClients(clientId) {
    const client = clients.find((client) => client.id === clientId);
    return client;
  }

  const handleEditBook = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`http://localhost:5088/books/${bookDetails.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.replace(/"/g, "")}`,
        },
        body: JSON.stringify(bookDetails),
      });

      if (response.ok) {
        api.fetchBooks(setBooks);
        setShowAddBookForm(false);
        setBookDetails({
          title: "",
          AuthorId: 0,
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
  };

  function handleEditBookClick(book) {
    setSelectedBookId(book.id);
  }

  const handleNavigateToUserProfile = () => {
    navigate("/userpage", { state: { user } });
  };

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
    setShowAddBookForm={setShowAddBookForm}
    authors={authors}
    theme={theme}
  />;

  return (
    <Container>
      {user && (
            <div style={{ marginLeft: "auto", fontSize: "1.5rem" }}>
              <p>Witaj, {user.sub}!</p>
            </div>
          )}

      <div>
        <h1>Księgarnia</h1>
        <h3>Nowe Publikacje Ulubionych Twórców</h3>
        <ul>
          {newPublications.map((publication) => (
            <li key={publication.id}>
              <strong>{publication.title}</strong> by {publication.authorName}
            </li>
          ))}
        </ul>
        {isAdmin ? (
          <AdminSection
            books={books}
            handleEditBookClick={handleEditBookClick}
            handleDeleteBook={handleDeleteBook}
            showAddBookForm={showAddBookForm}
            setShowAddBookForm={setShowAddBookForm}
            bookDetails={bookDetails}
            setBookDetails={setBookDetails}
            handleAddBook={handleAddBook}
            handleEditBook={handleEditBook}
            authors={authors}
            isEditing={isEditing}
            rentals={rentals}
            renderClientRentalsAdm={renderClientRentalsAdm}
            theme={theme}
          />
        ) : (
          <ClientSection
            books={books}
            rentals={rentals}
            user={user}
            dueDate={dueDate}
            handleDueDateChange={handleDueDateChange}
            handleBookRental={handleBookRental}
            rentalSuccess={rentalSuccess}
            handleSnackbarClose={handleSnackbarClose}
            getBookById={getBookById}
            client={client}
            formatDate={formatDate}
            authors={authors}
            selectedBookId={selectedBookId}
          />
        )}
        <h3>Katalog Książek</h3>
        <BookCatalog books={books} />
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
          <CommentsSection
            user={user}
            books={books}
            bookTitles={bookTitles}
            setBookTitles={setBookTitles}
          />
        )}
      </div>
    </Container>
  );
};
