import { DateTime } from "luxon";
import * as api from "../api/data";

export const loadNewPublications = async (credentialId, setNewPublications) => {
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
  
  export const handleSubscribeToAuthor = async (user, authorId, setNewPublications, setSubscriptions, credentialId) => {
    if (user) {
      await api.subscribeToAuthor(user.clientId, authorId);
      const newPublicationsData = await api.fetchNewPublicationsForSubscribedAuthors(credentialId);
      setNewPublications(newPublicationsData);
      loadNewPublications(credentialId, setNewPublications);
      const subscriptionsData = await api.fetchSubscriptionsForUser(user.clientId);
      setSubscriptions(subscriptionsData);
    } else {
      console.error("User is not logged in");
    }
  };
  
  export const handleUnsubscribeFromAuthor = async (selectedSubscription, setSubscriptions, setOpenDialog, user) => {
    if (selectedSubscription) {
      await api.unsubscribeFromAuthor(selectedSubscription);
      const subscriptionsData = await api.fetchSubscriptionsForUser(user.clientId);
      setSubscriptions(subscriptionsData);
      setOpenDialog(false);
      loadNewPublications();
    }
  };
  
  export const getSubscriptionId = (authorId, subscriptions) => {
    const subscription = subscriptions.find(subscription => subscription.authorId === authorId);
    return subscription ? subscription.id : null;
  };
  
  export const handleOpenDialog = (subscription, setSelectedSubscription, setOpenDialog) => {
    setSelectedSubscription(subscription);
    setOpenDialog(true);
  };
  
  export const handleCloseDialog = (setOpenDialog, setSelectedSubscription) => {
    setOpenDialog(false);
    setSelectedSubscription("");
  };
  
  export const formatDate = (dateString) => {
    const date = DateTime.fromISO(dateString);
    return date.toLocaleString(DateTime.DATETIME_FULL);
  };
  
  export const getBookById = (bookId, books) => {
    return books.find(book => book.id === bookId);
  };
  
  export function handleRentBook(setSelectedBookId, setShowRentalDatePicker, bookId) {
    setSelectedBookId(bookId);
    setShowRentalDatePicker(true);
  }
  
  export async function handleCancelRental(setSelectedBookId, setShowRentalDatePicker) {
    setSelectedBookId("");
    setShowRentalDatePicker(false);
  }
  
  export function handleDueDateChange(setDueDate, event) {
    return setDueDate(event.target.value);
  }
  
  export const handleSnackbarClose = (setRentalSuccess) => {
    setRentalSuccess(false);
  };
  
  export async function handleBookRental(user, selectedBookId, dueDate, setRentalSuccess, setRentals, setSelectedBookId) {
    try {
      const token = sessionStorage.getItem("authToken");
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
        const updatedRentals = await api.fetchRentals(setRentals);
        setRentals(updatedRentals);
        setSelectedBookId("");
      } else {
        console.error("Error renting the book:", response.statusText);
      }
    } catch (error) {
      console.error("Error renting the book:", error);
    }
  }
  
  export const handleAddBook = async (bookDetails, setBooks, setShowAddBookForm, setBookDetails) => {
    try {
      const response = await api.postBook(bookDetails);
      if (response.ok) {
        const newBook = await response.json();
        setBooks((prevBooks) => [...prevBooks, newBook]);
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
        const errorText = await response.text();
        console.error("Error adding the book:", response.statusText, errorText);
      }
    } catch (error) {
      console.error("Error adding the book:", error);
    }
  };
  
  export async function handleDeleteBook(bookId, setRentals, setBooks) {
    try {
      const token = sessionStorage.getItem("authToken");
  
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
          api.fetchBooks(setBooks); // Fetch books again if needed
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
  
  export function getClients(clientId) {
    const client = clients.find((client) => client.id === clientId);
    return client;
  }
  
  export const handleEditBook = async (bookDetails, setBooks, setShowAddBookForm, setBookDetails) => {
    try {
      const token = sessionStorage.getItem("authToken");
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
          authorId: 0,
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
  
  export function handleEditBookClick(book) {
    setSelectedBookId(book.id);
  }
  
  export function renderClientRentalsAdm() {
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