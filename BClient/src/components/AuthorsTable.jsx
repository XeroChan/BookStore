import React, { useState } from 'react';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Button, Stack, Pagination, TextField, Alert, Box } from '@mui/material';
import { getSubscriptionId, handleOpenDialog, handleSubscribeToAuthor } from '../helpers/storePageHelpers';
import AuthorForm from './AuthorForm';

const AuthorsTable = ({ user, isAdmin, authors, subscriptions, setNewPublications, setSubscriptions, setSelectedSubscription, setOpenDialog, credentialId, setAuthors }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAuthorForm, setShowAuthorForm] = useState(false);
  const [error, setError] = useState("");
  const authorsPerPage = 5;

  const handlePageChange = (_event, newPage) => {
    setCurrentPage(newPage);
  };

  const filteredAuthors = authors.filter((author) =>
    `${author.authorName.toLowerCase()} ${author.authorSurname.toLowerCase()}`.includes(searchQuery.toLowerCase())
  );

  const startIndex = (currentPage - 1) * authorsPerPage;
  const endIndex = startIndex + authorsPerPage;
  const authorsToShow = filteredAuthors.slice(startIndex, endIndex);

  return (
    <div>
      <TextField
        label="Wyszukaj autora"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
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
      {isAdmin && (
        <Box p={2}>
          <Button variant="contained" color="primary" onClick={() => setShowAuthorForm(true)}>
            Dodaj autora
          </Button>
        </Box>
      )}
      {showAuthorForm && <AuthorForm setShowAuthorForm={setShowAuthorForm} setError={setError} setAuthors={setAuthors}/>}
      {error && (
              <Box mt={2}>
                <Alert severity="error" style={{ padding: '1rem' }}>
                  {error}
                </Alert>
              </Box>
            )}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Imię</TableCell>
              <TableCell>Nazwisko</TableCell>
              {!isAdmin && <TableCell>Akcje</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {authorsToShow.map((author) => {
              const subscriptionId = getSubscriptionId(author.id, subscriptions);
              return (
                <TableRow key={author.id}>
                  <TableCell>{author.authorName}</TableCell>
                  <TableCell>{author.authorSurname}</TableCell>
                  {!isAdmin && (
                    <TableCell>
                      {subscriptionId ? (
                        <Button onClick={() => handleOpenDialog(subscriptionId, setSelectedSubscription, setOpenDialog)}>Subskrybowano</Button>
                      ) : (
                        <Button onClick={() => handleSubscribeToAuthor(user, author.id, setNewPublications, setSubscriptions, credentialId)}>Subskrybuj</Button>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Stack spacing={2} style={{ marginTop: '1rem', textAlign: 'center' }}>
        <Pagination
          count={Math.ceil(filteredAuthors.length / authorsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          variant="outlined"
          color="primary"
          style={{ marginLeft: 'auto', marginRight: 'auto' }}
        />
      </Stack>
    </div>
  );
};

export default AuthorsTable;