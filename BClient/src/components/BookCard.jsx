import React from "react";
import { Card, CardContent, CardMedia, CardActions, Button, Typography } from "@mui/material";

const BookCard = ({ book, onRent }) => (
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
    <CardActions style={{ justifyContent: "center", marginTop: "30px" }}>
      <Button variant="contained" color="primary" onClick={() => onRent(book.id)}>
        Wypożycz
      </Button>
    </CardActions>
  </Card>
);

export default BookCard;