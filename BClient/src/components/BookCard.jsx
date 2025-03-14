import React from "react";
import { Card, CardMedia, CardContent, Typography, CardActions, Button } from "@mui/material";

const BookCard = ({ book, author, onRent, selectedBookId, isAdmin, onViewDetails }) => {
  return (
    <Card
      style={{
        border: selectedBookId === book.id ? "4px solid" : "none",
        animation: selectedBookId === book.id ? "borderColorChange 2s infinite" : "none",
        transition: "border-color 1.5s ease-in-out",
      }}
    >
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
          {author
            ? `${author.authorName} ${author.authorSurname}`
            : "Unknown Author"}
        </Typography>
        <Typography variant="body2">{book.price} zł</Typography>
      </CardContent>
      <CardActions style={{ justifyContent: "center", marginTop: "30px" }}>
        <Button variant="contained" color="primary" onClick={() => onViewDetails(book)}>
          Szczegóły
        </Button>
        {!isAdmin && (
          <Button variant="contained" color="primary" onClick={() => onRent(book.id)}>
            Wypożycz
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default BookCard;