import { Button, TextField } from "@mui/material";
const RentalDatePicker = ({ dueDate, handleDueDateChange, handleBookRental, handleCancelRental }) => (
    <div
        style={{ marginTop: "20px", display: "flex", alignItems: "center" }}
    >
        <TextField
            id="due-date"
            label="Data  oddania"
            type="datetime-local"
            value={dueDate}
            onChange={handleDueDateChange}
            InputLabelProps={{
                shrink: true,
            }}
            style={{ marginRight: "10px" }}
        />
        <Button
            variant="contained"
            color="primary"
            onClick={handleBookRental}
            style={{ marginRight: "10px" }}
        >
            Wypożycz książkę
        </Button>
        <Button variant="contained" color="primary" onClick={handleCancelRental}>
            Anuluj
        </Button>
    </div>
);

export default RentalDatePicker;