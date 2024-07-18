import React from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';

const SearchBar = ({ onSearch }) => {
  const handleSearchChange = (event) => {
    if (onSearch) {
      onSearch(event.target.value);
    }
  };

  return (
    <TextField
      variant="standard"
      placeholder="Search..."
      onChange={handleSearchChange}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
     
    />
  );
};

export default SearchBar;
