import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";

const BookFilter = ({
  filterCriteria,
  setFilterCriteria,
  searchQuery,
  setSearchQuery,
}) => {
  const handleFilterChange = (event) => {
    setFilterCriteria(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div>
      <FormControl variant="outlined" fullWidth>
        <InputLabel id="filter-label" sx={{ color: "#9bc9db" }}>Filtruj po</InputLabel>
        <Select
          labelId="filter-label"
          id="filter"
          value={filterCriteria}
          onChange={handleFilterChange}
          label="Filter by"
          sx={{
            color: "#9bc9db",
            ".MuiSelect-icon": {
              color: "#9bc9db",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#9bc9db",
            },
          }}
        >
          <MenuItem value="title">Tytuł</MenuItem>
          <MenuItem value="author">Autor</MenuItem>
          <MenuItem value="genre">Gatunek</MenuItem>
          <MenuItem value="publisher">Wydawca</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="Wyszukaj"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchQuery}
        onChange={handleSearchChange}
        InputLabelProps={{
          sx: {
            color: "#9bc9db",
          },
        }}
        InputProps={{
          sx: {
            color: "#ffffff",
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#9bc9db",
            },
          },
        }}
      />
    </div>
  );
};

export default BookFilter;
