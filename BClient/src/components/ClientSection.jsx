import React, { useState } from "react";
import { Stack, Pagination } from "@mui/material";
import RentalDatePicker from "../components/RentalDatePicker";
import RentalSnackbar from "../components/RentalSnackbar";
import ClientRentals from "../components/ClientRentals";

const ClientSection = ({
  books,
  rentals,
  user,
  dueDate,
  handleDueDateChange,
  handleBookRental,
  rentalSuccess,
  handleSnackbarClose,
  getBookById,
  client,
  formatDate,
  authors,
  selectedBookId, // Accept selectedBookId as a prop
}) => {
  const [currentRPage, setCurrentRPage] = useState(1);
  const RentalsPerPage = 4;

  const filteredRentals = rentals.filter((rental) => {
    const userClientId = user?.clientId ? parseInt(user.clientId, 10) : null;
    return rental.clientId === userClientId;
  });

  const totalPages = Math.ceil(filteredRentals.length / RentalsPerPage);
  const startIndex = (currentRPage - 1) * RentalsPerPage;
  const rentalsToShow = filteredRentals.slice(startIndex, startIndex + RentalsPerPage);

  const handleRPageChange = (_event, newPage) => {
    setCurrentRPage(newPage);
  };

  return (
    <div>
      <h2>Katalog</h2>
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

      <div style={{ marginTop: "40px" }}>
        <h2>Twoje wypożyczenia</h2>
        <ClientRentals
          rentalsToShow={rentalsToShow}
          getBookById={getBookById}
          client={client}
          formatDate={formatDate}
          authors={authors}
        />
        <Stack spacing={2} style={{ marginTop: "5vh", textAlign: "center" }}>
          <Pagination
            count={totalPages}
            page={currentRPage}
            onChange={handleRPageChange}
            variant="outlined"
            color="primary"
            style={{ marginLeft: "auto", marginRight: "auto" }}
          />
        </Stack>
      </div>
    </div>
  );
};

export default ClientSection;