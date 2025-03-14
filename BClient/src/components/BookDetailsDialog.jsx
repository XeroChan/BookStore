import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";

const BookDetailsDialog = ({ open, onClose, book, author }) => {
  if (!book) return null;

  const formattedReleaseDate = new Date(book.releaseDate).toLocaleDateString();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{book.title}</DialogTitle>
      <DialogContent dividers>
        <Typography variant="subtitle1" color="textSecondary">
          {author ? `${author.authorName} ${author.authorSurname}` : "Nieznany autor"}
        </Typography>
        <Typography variant="body1" paragraph>
          {book.description}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Wydawca: {book.publisher}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Gatunek: {book.genre}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          ISBN: {book.isbn}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Strony: {book.pagesCount}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Cena: {book.price} zł
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Data wydania: {formattedReleaseDate}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Zamknij
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BookDetailsDialog;