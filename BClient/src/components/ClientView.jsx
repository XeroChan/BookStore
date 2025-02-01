import React from 'react';
import { Stack, Pagination } from '@mui/material';
import ClientRentals from './ClientRentals';
import RentalDatePicker from './RentalDatePicker';
import RentalSnackbar from './RentalSnackbar';

const ClientView = ({
  rentalsToShow,
  getBookById,
  client,
  formatDate,
  authors,
  selectedBookId,
  dueDate,
  handleDueDateChange,
  handleBookRental,
  rentalSuccess,
  handleSnackbarClose,
  currentRPage,
  totalPages,
  handleRPageChange,
}) => {
  return (
    <div>
      <h2>Katalog</h2>
      {/* Render book catalog here */}
      {selectedBookId && (
        <RentalDatePicker
          dueDate={dueDate}
          handleDueDateChange={handleDueDateChange}
          handleBookRental={handleBookRental}
        />
      )}

      <RentalSnackbar
        rentalSuccess={rentalSuccess}
        handleSnackbarClose={handleSnackbarClose}
      />

      {/* Display the list of client rentals */}
      <div style={{ marginTop: "40px" }}>
        <h2>Twoje wypożyczenia</h2>

        <ClientRentals
          rentalsToShow={rentalsToShow}
          getBookById={getBookById}
          client={client}
          formatDate={formatDate}
          authors={authors}
        />

        {/* Render pagination controls */}
        <Stack spacing={2} style={{ marginTop: "5vh", textAlign: "center" }}>
          <Pagination
            count={totalPages}
            page={currentRPage}
            onChange={handleRPageChange}
            variant="outlined"
            color="primary"
            style={{ marginLeft: "auto", marginRight: "auto" }} // Center pagination
          />
        </Stack>
      </div>
    </div>
  );
};

export default ClientView;