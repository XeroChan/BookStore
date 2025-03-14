import React, { useState, useEffect } from "react";
import { Stack, Pagination } from "@mui/material";
import RentalSnackbar from "../components/RentalSnackbar";
import ClientRentals from "../components/ClientRentals";
import { fetchRentals } from "../api/data";

const ClientSection = ({
  rentals,
  setRentals,
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
  selectedBookId,
}) => {
  const [currentRPage, setCurrentRPage] = useState(1);
  const RentalsPerPage = 4;

  const filteredRentals = Array.isArray(rentals) ? rentals.filter((rental) => {
    const userClientId = user?.clientId ? parseInt(user.clientId, 10) : null;
    return rental.clientId === userClientId;
  }) : [];

  const totalPages = Math.ceil(filteredRentals.length / RentalsPerPage);
  const startIndex = (currentRPage - 1) * RentalsPerPage;
  const rentalsToShow = filteredRentals.slice(startIndex, startIndex + RentalsPerPage);

  const handleRPageChange = (_event, newPage) => {
    setCurrentRPage(newPage);
  };

  useEffect(() => {
    // Fetch rentals data when rentalSuccess changes
    if (rentalSuccess) {
      fetchRentals(setRentals);
    }
  }, [rentalSuccess, setRentals]);

  return (
    <div>
      <h2>Katalog</h2>

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