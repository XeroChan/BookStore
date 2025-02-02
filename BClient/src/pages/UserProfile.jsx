import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchUserComments, fetchBookDetails, deleteComment } from '../api/data';
import { Button, Container, Typography, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/system';

const CenteredContainer = styled(Container)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  textAlign: 'center',
});

export const UserProfile = ({ user, setUser }) => {
  const location = useLocation();
  const [comments, setComments] = useState([]);
  const [bookTitles, setBookTitles] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    console.log('State:', location.state);
    console.log('User:', user);

    if (user?.clientId) {
      fetchUserComments(user.clientId, async (comments) => {
        setComments(comments);
        const titles = {};
        for (const comment of comments) {
          const bookDetails = await fetchBookDetails(comment.bookId);
          if (bookDetails) {
            titles[comment.bookId] = bookDetails.title;
          }
        }
        setBookTitles(titles);
      });
    } else {
      console.error("User ID is undefined. Please login again.");
    }
  }, [user]);

  const handleBackToStore = () => {
    navigate('/store');
  };

  const handleDeleteComment = async (commentId) => {
    await deleteComment(commentId);
    if (user?.clientId) {
      fetchUserComments(user.clientId, async (comments) => {
        setComments(comments);
        const titles = {};
        for (const comment of comments) {
          const bookDetails = await fetchBookDetails(comment.bookId);
          if (bookDetails) {
            titles[comment.bookId] = bookDetails.title;
          }
        }
        setBookTitles(titles);
      });
    } else {
      console.error("User ID is undefined. Please login again.");
    }
  };

  return (
    <CenteredContainer>
      <Typography variant="h4" gutterBottom>
        Profil użytkownika
      </Typography>
      {user ? (
        <Typography variant="h6">Witaj, {user.sub}!</Typography>
      ) : (
        <Typography variant="h6">Nie znaleziono użytkownika. Proszę zalogować się ponownie.</Typography>
      )}

      <Typography variant="h5" gutterBottom>
        Moje Komentarze
      </Typography>
      <List>
        {comments.map((comment) => (
          <ListItem key={comment.id}>
            <ListItemText
              primary={bookTitles[comment.bookId] || 'Loading...'}
              secondary={`Ocena: ${comment.rating}/5 - ${comment.commentString}`}
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteComment(comment.id)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </CenteredContainer>
  );
};