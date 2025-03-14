import React, { useState } from 'react';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Button, Stack, Pagination } from '@mui/material';
import { getSubscriptionId, handleOpenDialog, handleSubscribeToAuthor } from '../helpers/storePageHelpers';

const AuthorsTable = ({ user, isAdmin, authors, subscriptions, setNewPublications, setSubscriptions, setSelectedSubscription, setOpenDialog, credentialId }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const authorsPerPage = 5;
  const handlePageChange = (_event, newPage) => {
    setCurrentPage(newPage);
  };

  const startIndex = (currentPage - 1) * authorsPerPage;
  const endIndex = startIndex + authorsPerPage;
  const authorsToShow = authors.slice(startIndex, endIndex);

  return (
    <div>
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
          count={Math.ceil(authors.length / authorsPerPage)}
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