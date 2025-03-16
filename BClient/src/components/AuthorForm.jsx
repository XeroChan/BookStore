import React, { useState, useEffect } from 'react';
import { Box, Button, Checkbox, FormControlLabel, FormGroup, Paper, Typography } from '@mui/material';
import * as api from '../api/data';

const AuthorForm = ({ setShowAuthorForm }) => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    const fetchUsersAndAuthors = async () => {
      const usersData = await api.fetchUsersWithAuthorFlag();
      const authorsData = await api.fetchAuthors();
      const authorIds = new Set(authorsData.map(author => author.credentialId));
      const filteredUsers = usersData.filter(user => !authorIds.has(user.id));
      setUsers(filteredUsers);
    };
    fetchUsersAndAuthors();
  }, []);

  const handleCheckboxChange = (userId) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId)
        : [...prevSelected, userId]
    );
  };

  const handleSave = async () => {
    await api.addAuthors(selectedUsers);
    setShowAuthorForm(false);
  };

  return (
    <Paper style={{ padding: '1rem', maxHeight: '400px', overflowY: 'auto' }}>
      <Typography variant="h6">Dodaj autora</Typography>
      <FormGroup>
        {users.map((user) => (
          <FormControlLabel
            key={user.id}
            control={
              <Checkbox
                checked={selectedUsers.includes(user.id)}
                onChange={() => handleCheckboxChange(user.id)}
              />
            }
            label={`${user.username}`}
          />
        ))}
      </FormGroup>
      <Box mt={2}>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Zapisz
        </Button>
        <Button variant="contained" color="secondary" onClick={() => setShowAuthorForm(false)} style={{ marginLeft: '1rem' }}>
          Anuluj
        </Button>
      </Box>
    </Paper>
  );
};

export default AuthorForm;