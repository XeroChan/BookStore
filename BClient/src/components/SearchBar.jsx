import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";

const SearchBar = ({ setSearchQuery }) => {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    setSearchQuery(value);
  };

  return (
    <form>
      <TextField
        id="search-bar"
        className="text"
        onChange={handleSearch}
        value={query}
        label="Wyszukaj"
        variant="outlined"
        placeholder="Wyszukaj..."
        size="small"
        InputProps={{
          endAdornment: (
            <IconButton type="submit" aria-label="search">
              <SearchIcon style={{ fill: "dodgerblue" }} />
            </IconButton>
          ),
        }}
        style={{ marginBottom: "20px" }}
      />
    </form>
  );
};

export default SearchBar;
