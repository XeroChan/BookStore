import React from 'react';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Button } from '@mui/material';

const AuthorsTable = ({ authors, getSubscriptionId, handleSubscribeToAuthor, handleOpenDialog }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Imię</TableCell>
            <TableCell>Nazwisko</TableCell>
            <TableCell>Akcje</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {authors.map((author) => {
            const subscriptionId = getSubscriptionId(author.id);
            return (
              <TableRow key={author.id}>
                <TableCell>{author.authorName}</TableCell>
                <TableCell>{author.authorSurname}</TableCell>
                <TableCell>
                  {subscriptionId ? (
                    <Button onClick={() => handleOpenDialog(subscriptionId)}>Subskrybowano</Button>
                  ) : (
                    <Button onClick={() => handleSubscribeToAuthor(author.id)}>Subskrybuj</Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AuthorsTable;