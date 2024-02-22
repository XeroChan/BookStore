import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const RentalFilter = ({ filterCriteria, setFilterCriteria }) =>
{
    const handleFilterChange = (event) =>
    {
        setFilterCriteria(event.target.value);
    };

    return (
        <FormControl variant="outlined" fullWidth>
            <InputLabel id="rental-filter-label">Filter by</InputLabel>
            <Select
                labelId="rental-filter-label"
                id="rental-filter"
                value={filterCriteria}
                onChange={handleFilterChange}
                label="Filter by"
            >
                <MenuItem value="clientName">Client Name</MenuItem>
                <MenuItem value="bookTitle">Book Title</MenuItem>
                <MenuItem value="rentalDate">Rental Date</MenuItem>
                {/* Add more filter options here */}
            </Select>
        </FormControl>
    );
};

export default RentalFilter;
