import React, { useEffect, useState, useRef } from "react";
import {
  TextField,
  Button,
  IconButton,
  Select,
  Stack,
  Pagination,
  MenuItem,
} from "@mui/material";
import * as api from "../api/data";
import { Link } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const CommentsSection = ({
  user,
  books,
  bookTitles,
  setBookTitles,
  isAdmin,
}) => {
  const [allComments, setAllComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 5;
  const [selectedBookId, setSelectedBookId] = useState("");
  const bookTitlesRef = useRef(bookTitles);
  const [editingComment, setEditingComment] = useState(null);
  const [editedCommentText, setEditedCommentText] = useState("");
  const [editedCommentRating, setEditedCommentRating] = useState(0);

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
      await api.postComment(
        user.clientId,
        selectedBookId,
        newComment,
        newRating
      );
      setNewComment("");
      setNewRating(0);
      setSelectedBookId("");
      fetchData();
    }
  };

  const handleDeleteComment = async (commentId) => {
    await api.deleteComment(commentId);
    fetchData();
  };

  const handleEditComment = (comment) => {
    setEditingComment(comment);
    setEditedCommentText(comment.commentString);
    setEditedCommentRating(comment.rating);
  };

  const handleUpdateComment = async () => {
    if (editingComment) {
      await api.updateComment(editingComment.id, editedCommentText, editedCommentRating);
      setEditingComment(null);
      fetchData();
    }
  };

  return (
    <div>
      {!isAdmin && (
        <>
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
        </>
      )}

      <h3>Wszystkie komentarze</h3>
      {commentsToShow.map((comment) => (
        <div key={comment.id}>
          <p>
            <strong>
              <Link to={`/userprofile/${comment.credentialId}`}>
                {comment.username}
              </Link>
            </strong>{" "}
            ({bookTitles[comment.bookId]}): {comment.comment}
          </p>
          <p>{comment.commentString}</p>
          <p>Ocena: {comment.rating}</p>
          {isAdmin && (
            <div>
              <IconButton onClick={() => handleEditComment(comment)}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => handleDeleteComment(comment.id)}>
                <DeleteIcon />
              </IconButton>
            </div>
          )}
        </div>
      ))}
      {editingComment && (
        <div>
          <h3>Edytuj</h3>
          <TextField
            label="Komentarz"
            value={editedCommentText}
            onChange={(e) => setEditedCommentText(e.target.value)}
            fullWidth
          />
          <TextField
            label="Ocena"
            type="number"
            value={editedCommentRating}
            onChange={(e) => setEditedCommentRating(Number(e.target.value))}
            inputProps={{ min: 0, max: 5 }}
            fullWidth
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdateComment}
          >
            Zapisz
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setEditingComment(null)}
          >
            Anuluj
          </Button>
        </div>
      )}

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