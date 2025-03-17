import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { fetchUserComments, fetchBookDetails, deleteComment, updateClientDescription, fetchClientDescription, fetchCredentialByClientId, verifyAuthor } from '../api/data';
import { Button, Box, Container, TextField, Typography, Grid, IconButton, Card, CardContent, CardActions, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Pagination } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { styled } from '@mui/system';
import DeleteAccount from '../components/DeleteAccount';

const CenteredContainer = styled(Container)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  textAlign: 'center',
});

const CommentCard = styled(Card)({
  marginBottom: '1rem',
  backgroundColor: '#ffffff',
  width: '100%',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  padding: '1rem',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  height: '100%',
});

export const UserProfile = ({ user, setIsAuthenticated }) => {
  const location = useLocation();
  const { clientId } = useParams();
  const [comments, setComments] = useState([]);
  const [bookTitles, setBookTitles] = useState({});
  const [description, setDescription] = useState("");
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [profileUser, setProfileUser] = useState(null);
  const [username, setUsername] = useState("Brak nazwy użytkownika");
  const [currentPage, setCurrentPage] = useState(1);
  const [commentsPerPage] = useState(9);
  const [selectedComment, setSelectedComment] = useState(null);
  const [isAuthor, setIsAuthor] = useState(user?.isAuthor || 0);

  const isOwnProfile = !clientId || clientId === user?.clientId.toString();
  const isAdmin = user?.role === "Admin";

  useEffect(() => {
    const fetchData = async () => {
      const id = clientId || user?.clientId;

      if (id) {
        try {
          const desc = await fetchClientDescription(id);
          setDescription(desc.description || "Brak opisu");

          const cred = await fetchCredentialByClientId(id);
          const username = cred?.username;
          setUsername(username || "Brak nazwy użytkownika");
          setIsAuthor(cred?.isAuthor || 0);

          const comments = await fetchUserComments(id);
          setComments(comments);
          const titles = {};
          for (const comment of comments) {
            const bookDetails = await fetchBookDetails(comment.bookId);
            if (bookDetails) {
              titles[comment.bookId] = bookDetails.title;
            }
          }
          setBookTitles(titles);

          if (clientId) {
            setProfileUser(cred);
          } else {
            setProfileUser(user);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [user, clientId]);

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleSave = async () => {
    await updateClientDescription(user.clientId, description);
    setIsEditingDescription(false);
    // Fetch the updated description after saving
    const updatedDescription = await fetchClientDescription(user.clientId);
    setDescription(updatedDescription.description || "Brak opisu");
  };

  const handleEditDescription = () => {
    if (description === "Brak opisu") {
      setDescription("");
    }
    setIsEditingDescription(true);
  };

  const handleDeleteComment = async (commentId) => {
    await deleteComment(commentId);
    if (user?.clientId) {
      const comments = await fetchUserComments(user.clientId);
      setComments(comments);
      const titles = {};
      for (const comment of comments) {
        const bookDetails = await fetchBookDetails(comment.bookId);
        if (bookDetails) {
          titles[comment.bookId] = bookDetails.title;
        }
      }
      setBookTitles(titles);
    } else {
      console.error("User ID is undefined. Please login again.");
    }
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleOpenComment = (comment) => {
    setSelectedComment(comment);
  };

  const handleCloseComment = () => {
    setSelectedComment(null);
  };

  const handleVerifyAuthor = async () => {
    try {
      await verifyAuthor(user.clientId);
      alert("User verified as author successfully.");
      setIsAuthor(1);
    } catch (error) {
      console.error("Error verifying author:", error);
      alert("Failed to verify user as author.");
    }
  };

  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = comments.slice(indexOfFirstComment, indexOfLastComment);

  if (!profileUser) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  return (
    <CenteredContainer>
      {isOwnProfile ? (
        <>
          <Typography variant="h6">Witaj, {user.sub}!</Typography>
        </>
      ) : (
        <Typography variant="h4" gutterBottom>
          Profil użytkownika {username}
        </Typography>
      )}
      {isOwnProfile && (
        <>
          {isEditingDescription ? (
            <>
              <TextField
                label="Opis"
                variant="outlined"
                multiline
                rows={4}
                value={description}
                onChange={handleDescriptionChange}
                fullWidth
                margin="normal"
                InputLabelProps={{
                  sx: {
                    color: "#9bc9db",
                  },
                }}
                InputProps={{
                  sx: {
                    color: "#ffffff",
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#89c7fa",
                    },
                  },
                }}
              />
              <Button variant="contained" color="primary" onClick={handleSave}>
                Zapisz
              </Button>
            </>
          ) : (
            <>
              <Typography variant="body1" gutterBottom>
                Opis: <br></br> {description}
              </Typography>
              <Button variant="contained" color="primary" onClick={handleEditDescription} startIcon={<EditIcon />}>
                Edytuj
              </Button>
            </>
          )}
          <Box sx={{ padding: '16px' }}>
            {!isAdmin && <DeleteAccount clientId={user.clientId} setIsAuthenticated={setIsAuthenticated} />}
          </Box>
          {isAuthor !== 1 && (
            <Button variant="contained" color="secondary" onClick={handleVerifyAuthor}>
              Weryfikuj autora
            </Button>
          )}
        </>
      )}

      {!isOwnProfile && (
        <Typography variant="body1" gutterBottom>
          Opis: <br></br>{description}
        </Typography>
      )}

      <Typography variant="h5" gutterBottom>
        Komentarze użytkownika {username}
      </Typography>
      <Grid container spacing={3}> {/* Adjust spacing here */}
        {currentComments.map((comment) => (
          <Grid item xs={12} sm={6} md={4} key={comment.id}>
            <CommentCard>
              <CardContent>
                <Typography variant="h6">{bookTitles[comment.bookId] || 'Loading...'}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Ocena: {comment.rating}/5
                </Typography>
                <Typography variant="body1" noWrap>{comment.commentString}</Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary" onClick={() => handleOpenComment(comment)}>
                  Czytaj więcej
                </Button>
                {isOwnProfile && (
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteComment(comment.id)}>
                    <DeleteIcon />
                  </IconButton>
                )}
              </CardActions>
            </CommentCard>
          </Grid>
        ))}
      </Grid>
      <Pagination
        count={Math.ceil(comments.length / commentsPerPage)}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
        style={{ marginTop: '1rem' }}
      />
      <Dialog open={Boolean(selectedComment)} onClose={handleCloseComment} maxWidth="md" fullWidth>
        <DialogTitle>{selectedComment?.bookTitle}</DialogTitle>
        <DialogContent dividers style={{ overflowY: 'auto' }}> {/* Ensure vertical scroll */}
          <DialogContentText style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
            {selectedComment?.commentString}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseComment} color="primary">
            Zamknij
          </Button>
        </DialogActions>
      </Dialog>
    </CenteredContainer>
  );
};