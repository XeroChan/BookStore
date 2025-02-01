import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

const ClientRentals = ({
  rentalsToShow,
  getBookById,
  client,
  formatDate,
  authors,
}) => {
  return (
    <TableContainer component={Paper}>
      <Table>
      <TableHead>
        <TableRow>
          <TableCell>Tytuł</TableCell>
          <TableCell>Autor</TableCell>
          <TableCell>Cena</TableCell>
          <TableCell>Imię</TableCell>
          <TableCell>Nazwisko</TableCell>
          <TableCell>Email</TableCell>
          <TableCell>Data wypożyczenia</TableCell>
          <TableCell>Data oddania</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rentalsToShow.map((rental) => {
          const book = getBookById(rental.bookId);
          console.log('Book:', book); // Debug statement
          const author = authors.find(author => author.id === book?.authorId);
          console.log('Author:', author); // Debug statement
          return (
            <TableRow key={rental.id}>
              <TableCell>{book?.title || "N/A"}</TableCell>
              <TableCell>{author ? `${author.authorName} ${author.authorSurname}` : "N/A"}</TableCell>
              <TableCell>{book?.price ? `${book.price} zł` : "N/A"}</TableCell>
              <TableCell>{client?.name || "N/A"}</TableCell>
              <TableCell>{client?.surname || "N/A"}</TableCell>
              <TableCell>{client?.email || "N/A"}</TableCell>
              <TableCell>{formatDate(rental.rentalDate) || "N/A"}</TableCell>
              <TableCell>{formatDate(rental.dueDate) || "N/A"}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
    </TableContainer>
  );
};

export default ClientRentals;
