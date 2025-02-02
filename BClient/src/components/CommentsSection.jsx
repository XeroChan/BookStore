import React, { useEffect, useState, useRef } from "react";
import { TextField, Button, Select, Stack, Pagination, MenuItem } from "@mui/material";
import * as api from "../api/data";

const CommentsSection = ({ user, books, bookTitles, setBookTitles }) => {
  const [allComments, setAllComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 5;
  const [selectedBookId, setSelectedBookId] = useState("");
  const bookTitlesRef = useRef(bookTitles);

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

  useEffect(() => {
    fetchData();
  }, [setBookTitles]);

  const handlePageChange = (_event, newPage) => {
    setCurrentPage(newPage);
  };

  const startIndex = (currentPage - 1) * commentsPerPage;
  const endIndex = startIndex + commentsPerPage;
  const commentsToShow = allComments.slice(startIndex, endIndex);

  const handlePostComment = async () => {
    if (selectedBookId && newComment && newRating >= 0 && newRating <= 5) {
      await api.postComment(user.clientId, selectedBookId, newComment, newRating);
      setNewComment("");
      setNewRating(0);
      setSelectedBookId("");
      fetchData();
    }
  };

  return (
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
      <Button variant="contained" color="primary" onClick={handlePostComment}>
        Dodaj Komentarz
      </Button>

      <h3>All Comments</h3>
      {commentsToShow.map((comment) => (
        <div key={comment.id}>
          <p><strong>{comment.username}</strong> ({bookTitles[comment.bookId]}): {comment.comment}</p>
          <p>{comment.commentString}</p>
          <p>Rating: {comment.rating}</p>
        </div>
      ))}

      <Stack spacing={2} style={{ marginTop: "2vh", textAlign: "center" }}>
        <Pagination
          count={Math.ceil(allComments.length / commentsPerPage)}
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

export default CommentsSection;