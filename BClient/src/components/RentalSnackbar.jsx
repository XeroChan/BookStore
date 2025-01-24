import { Snackbar } from "@mui/material";
const RentalSnackbar = ({ rentalSuccess, handleSnackbarClose }) => (
    rentalSuccess && (
        <Snackbar
            open={rentalSuccess}
            autoHideDuration={1800}
            onClose={handleSnackbarClose}
            message="Pomyślnie wypożyczono."
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
        />
    )
);

export default RentalSnackbar;
