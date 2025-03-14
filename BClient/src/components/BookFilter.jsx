import React from "react";
import { FormControl, InputLabel, Select, MenuItem, TextField } from "@mui/material";

const BookFilter = ({ filterCriteria, setFilterCriteria, searchQuery, setSearchQuery }) => {
  const handleFilterChange = (event) => {
    setFilterCriteria(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div>
      <FormControl variant="outlined" fullWidth>
        <InputLabel id="filter-label">Filtruj po</InputLabel>
        <Select
          labelId="filter-label"
          id="filter"
          value={filterCriteria}
          onChange={handleFilterChange}
          label="Filter by"
        >
          <MenuItem value="title">Tytuł</MenuItem>
          <MenuItem value="author">Autor</MenuItem>
          <MenuItem value="genre">Gatunek</MenuItem>
          <MenuItem value="publisher">Wydawca</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="Search"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchQuery}
        onChange={handleSearchChange}
      />
    </div>
  );
};

export default BookFilter;