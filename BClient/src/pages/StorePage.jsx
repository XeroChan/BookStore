import React, { useState, useRef } from "react";
import { Container } from "@mui/material";
import { theme } from "../components/theme";
import {
  handleUnsubscribeFromAuthor,
  handleCloseDialog,
  formatDate,
  getBookById,
  handleRentBook,
  handleCancelRental,
  handleDueDateChange,
  handleSnackbarClose,
  handleBookRental,
  handleAddBook,
  handleDeleteBook,
  handleEditBook,
  handleEditBookClick,
} from "../helpers/storePageHelpers";
import { useFetchData } from "../hooks/useFetchData";
import AdminSection from "../components/AdminSection";
import ClientSection from "../components/ClientSection";
import BookCatalog from "../components/BookCatalog";
import RentalDatePicker from "../components/RentalDatePicker";
import AuthorsTable from "../components/AuthorsTable";
import ConfirmationDialog from "../components/ConfirmationDialog";
import CommentsSection from "../components/CommentsSection";
import BookDetailsDialog from "../components/BookDetailsDialog";

export const StorePage = ({ user, setUser }) => {
  const [books, setBooks] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [clients, setClients] = useState([]);
  const [client, setClient] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [comments, setComments] = useState([]);
  const [allComments, setAllComments] = useState([]);
  const [bookTitles, setBookTitles] = useState({});
  const [selectedBookId, setSelectedBookId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [showAddBookForm, setShowAddBookForm] = useState(false);
  const [showRentalDatePicker, setShowRentalDatePicker] = useState(false);
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

  const [rentalSuccess, setRentalSuccess] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  useFetchData(
    setBooks,
    setAuthors,
    setSubscriptions,
    setCredentialId,
    user,
    credentialId,
    setNewPublications,
    setIsAdmin,
    setClients,
    setClient,
    setComments,
    setBookTitles,
    setAllComments,
    setUpdatedBook,
    setShowAddBookForm,
    setRentals,
    setUser,
    books,
    bookTitlesRef,
    selectedBookId,
    bookDetails,
    isAdmin
  );

  const handleRentBookWrapper = (bookId) =>
    handleRentBook(setSelectedBookId, setShowRentalDatePicker, bookId);
  const handleCancelRentalWrapper = () =>
    handleCancelRental(setSelectedBookId, setShowRentalDatePicker);
  const handleDueDateChangeWrapper = (event) =>
    handleDueDateChange(setDueDate, event);
  const handleSnackbarCloseWrapper = () =>
    handleSnackbarClose(setRentalSuccess);
  const handleBookRentalWrapper = () =>
    handleBookRental(
      user,
      selectedBookId,
      dueDate,
      setRentalSuccess,
      setRentals,
      setSelectedBookId
    );

  const handleViewDetails = (book) => {
    setSelectedBook(book);
    setDetailsDialogOpen(true);
  };

  const handleCloseDetailsDialog = () => {
    setDetailsDialogOpen(false);
    setSelectedBook(null);
  };

  return (
    <Container>
      {user && (
        <div style={{ marginLeft: "auto", fontSize: "1.5rem" }}>
          <p>Witaj, {user.sub}!</p>
        </div>
      )}

      <div>
        <h1>Księgarnia</h1>
        {!isAdmin && (
          <>
            <h3>Nowe Publikacje Ulubionych Twórców</h3>
            <ul>
              {newPublications.map((publication) => (
                <li key={publication.id}>
                  <strong>{publication.title}</strong> by {publication.authorName}
                </li>
              ))}
            </ul>
          </>
        )}
        {isAdmin ? (
          <AdminSection
            books={books}
            handleDeleteBook={handleDeleteBook}
            showAddBookForm={showAddBookForm}
            setShowAddBookForm={setShowAddBookForm}
            bookDetails={bookDetails}
            setBookDetails={setBookDetails}
            handleAddBook={handleAddBook}
            handleEditBook={handleEditBook}
            authors={authors}
            theme={theme}
            setBooks={setBooks}
            rentals={rentals}
            clients={clients}
            setRentals={setRentals}
          />
        ) : (
          <ClientSection
            rentals={rentals}
            setRentals={setRentals}
            user={user}
            dueDate={dueDate}
            handleDueDateChange={handleDueDateChangeWrapper}
            handleBookRental={handleBookRentalWrapper}
            rentalSuccess={rentalSuccess}
            handleSnackbarClose={handleSnackbarCloseWrapper}
            getBookById={(bookId) => getBookById(bookId, books)}
            client={client}
            formatDate={formatDate}
            authors={authors}
            selectedBookId={selectedBookId}
          />
        )}
        <h3>Katalog Książek</h3>
        <BookCatalog
          books={books}
          onRent={handleRentBookWrapper}
          selectedBookId={selectedBookId}
          authors={authors}
          isAdmin={isAdmin}
          handleEditBook={handleEditBookClick}
          onViewDetails={handleViewDetails}
        />
        {selectedBookId && (
          <RentalDatePicker
            dueDate={dueDate}
            handleDueDateChange={handleDueDateChangeWrapper}
            handleBookRental={handleBookRentalWrapper}
            handleCancelRental={handleCancelRentalWrapper}
          />
        )}
        <h3>Lista Twórców</h3>
        <AuthorsTable
          user={user}
          isAdmin={isAdmin}
          authors={authors}
          subscriptions={subscriptions}
          setNewPublications={setNewPublications}
          setSubscriptions={setSubscriptions}
          setSelectedSubscription={setSelectedSubscription}
          setOpenDialog={setOpenDialog}
          credentialId={credentialId}
        />
        <ConfirmationDialog
          open={openDialog}
          handleClose={() => handleCloseDialog(setOpenDialog, setSelectedSubscription)}
          handleConfirm={() => handleUnsubscribeFromAuthor(selectedSubscription, setSubscriptions, setOpenDialog, user)}
        />
        {user && (
          <CommentsSection
            user={user}
            books={books}
            bookTitles={bookTitles}
            setBookTitles={setBookTitles}
            isAdmin={isAdmin}
          />
        )}
      </div>
      <BookDetailsDialog
        open={detailsDialogOpen}
        onClose={handleCloseDetailsDialog}
        book={selectedBook}
        author={authors.find((author) => author.id === selectedBook?.authorId)}
      />
    </Container>
  );
};