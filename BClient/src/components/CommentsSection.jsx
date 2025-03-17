import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  TextField,
  Button,
  IconButton,
  Stack,
  Pagination,
  Autocomplete,
  FormControl,
  FormHelperText,
  Typography,
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
  const [errors, setErrors] = useState({});

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

  const validateForm = () => {
    const newErrors = {};
    if (!newComment) newErrors.newComment = "Komentarz jest wymagany";
    if (newRating < 0 || newRating > 5) newErrors.newRating = "Ocena musi być między 0 a 5";
    if (!selectedBookId) newErrors.selectedBookId = "Wybierz książkę";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePostComment = async () => {
    if (validateForm()) {
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
          <FormControl fullWidth error={!!errors.newComment}>
            <TextField
              label="Komentarz"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              fullWidth
              required
              InputLabelProps={{
                sx: {
                  color: "#9bc9db",
                },
              }}
              sx={{
                "&:hover .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#9bc9db",
                  },
                },
              }}
              InputProps={{
                sx: {
                  color: "#ffffff",
                },
              }}
            />
            {errors.newComment && <FormHelperText>{errors.newComment}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth error={!!errors.newRating}>
            <TextField
            InputProps={{
              sx: {
                color: "#ffffff",
              },
            }}
              label="Ocena"
              type="number"
              value={newRating}
              onChange={(e) => setNewRating(Math.min(Math.max(Number(e.target.value), 0), 5))}
              inputProps={{ min: 0, max: 5 }}
              fullWidth
              required
              InputLabelProps={{
                sx: {
                  color: "#9bc9db",
                },
              }}
              sx={{
                "& .MuiInputBase-root": {
                  color: "#9bc9db",
                },
                "&:hover .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#9bc9db",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#89c7fa",
                  },
                },
              }}
            />
            {errors.newRating && <FormHelperText>{errors.newRating}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth error={!!errors.selectedBookId}>
            <Autocomplete
              options={books.sort((a, b) => a.title.localeCompare(b.title))}
              getOptionLabel={(option) => option.title}
              value={books.find((book) => book.id === selectedBookId) || null}
              onChange={(_event, newValue) => setSelectedBookId(newValue ? newValue.id : "")}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Wybierz książkę"
                  fullWidth
                  required
                  InputLabelProps={{
                    sx: {
                      color: "#9bc9db",
                    },
                  }}
                  sx={{
                    "&:hover .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#9bc9db",
                      },
                    },
                  }}
                />
              )}
            />
            {errors.selectedBookId && <FormHelperText>{errors.selectedBookId}</FormHelperText>}
          </FormControl>
          <Box p={2}>
            <Button variant="contained" color="primary" onClick={handlePostComment}>
              Dodaj Komentarz
            </Button>
          </Box>
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
            InputLabelProps={{
              sx: {
                color: "#9bc9db",
              },
            }}
          />
          <TextField
            label="Ocena"
            type="number"
            value={editedCommentRating}
            onChange={(e) => setEditedCommentRating(Number(e.target.value))}
            inputProps={{ min: 0, max: 5 }}
            fullWidth
            InputLabelProps={{
              sx: {
                color: "#9bc9db",
              },
            }}
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