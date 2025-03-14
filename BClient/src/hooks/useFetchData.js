import { useEffect } from "react";
import * as api from "../api/data";
import { loadNewPublications, getBookById } from "../helpers/storePageHelpers";

export const useFetchData = (
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
  updatedBook,
  isAdmin
) => {
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
  }, [setBooks, bookTitlesRef, setBookTitles]);

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
  }, [setAllComments, bookTitlesRef, setBookTitles]);

  useEffect(() => {
    const fetchData = async () => {
      const authorsData = await api.fetchAuthors();
      setAuthors(authorsData);
      if (user) {
        const subscriptionsData = await api.fetchSubscriptionsForUser(
          user.clientId
        );
        setSubscriptions(subscriptionsData);
        const credentialId = await api.fetchCredentialIdByClientId(
          user.clientId
        );
        setCredentialId(credentialId);
      }
    };
    fetchData();
  }, [user, setAuthors, setSubscriptions, setCredentialId]);

  useEffect(() => {
    if (credentialId) {
      loadNewPublications(credentialId, setNewPublications);
    }
  }, [credentialId, setNewPublications]);

  useEffect(() => {
    if (user && user.role === "Admin") {
      setIsAdmin(true);
      api.fetchClients(setClients);
    } else {
      setIsAdmin(false);
    }
  }, [user, setIsAdmin, setClients]);

  useEffect(() => {
    if (!isAdmin && user && user.clientId) {
      api.fetchClientById(user.clientId, setClient);
    }
  }, [isAdmin, user, setClient]);

  useEffect(() => {
    if (selectedBookId) {
      const selectedBook = getBookById(selectedBookId, books);
      if (selectedBook) {
        setUpdatedBook({ ...updatedBook, id: selectedBookId });
        setShowAddBookForm(true);
      }
    }
  }, [selectedBookId, setUpdatedBook, updatedBook, setShowAddBookForm, books]);

  useEffect(() => {
    if (!user) {
      api.getUserInfo(setUser);
    }
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
  }, [user, setUser, setBooks, setRentals, setComments, setBookTitles]);
};