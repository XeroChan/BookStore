import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  ThemeProvider,
  Autocomplete,
} from "@mui/material";

const BookForm = ({
  bookDetails,
  setBookDetails,
  isEditing,
  handleAddBook,
  handleEditBook,
  authors,
  theme,
  handleCancel,
}) => {
  const [isbnError, setIsbnError] = useState(false);
  const [imageUriError, setImageUriError] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    if (isEditing && bookDetails && initialLoad) {
      // Ensure releaseDate is in the correct format
      if (bookDetails.releaseDate) {
        const formattedDate = new Date(bookDetails.releaseDate)
          .toISOString()
          .split("T")[0];
        setBookDetails((prevState) => ({
          ...prevState,
          releaseDate: formattedDate,
        }));
      }
      // Ensure AuthorId is set
      if (bookDetails.authorId) {
        setBookDetails((prevState) => ({
          ...prevState,
          AuthorId: bookDetails.authorId,
        }));
      }
      setInitialLoad(false);
    }
  }, [isEditing, bookDetails, setBookDetails, initialLoad]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "pagesCount" || name === "price") {
      newValue = Number(value);
      if (name === "pagesCount" && newValue > maxPagesCount) {
        newValue = maxPagesCount;
      }
      if (name === "price" && newValue > maxPrice) {
        newValue = maxPrice;
      }
    }

    setBookDetails((prevState) => ({
      ...prevState,
      [name]: newValue,
    }));
  };

  const handleSelectChange = (e) => {
    const AuthorId = parseInt(e.target.value, 10);
    setBookDetails((prevState) => ({
      ...prevState,
      AuthorId: AuthorId,
    }));
  };

  const handleKeyPress = (e) => {
    const charCode = e.charCode;
    if (charCode !== 58 && (charCode < 48 || charCode > 57)) {
      e.preventDefault();
    }
  };

  const handlePaste = (e) => {
    const paste = (e.clipboardData || window.clipboardData).getData("text");
    if (!/^\d+$/.test(paste)) {
      e.preventDefault();
    }
  };

  const maxTitleLength = 100;
  const maxPublisherLength = 40;
  const maxGenreLength = 50;
  const maxDescriptionLength = 800;
  const maxISBNLength = 13;
  const minPagesCount = 1;
  const maxPagesCount = 2000;
  const maxPrice = 200;
  const maxUriLength = 250;

  const isValidImageUri = (uri) => {
    const regex = /^(https?:\/\/).*\.(jpeg|jpg|gif|png|svg)$/i;
    return regex.test(uri);
  };

  const handleSubmit = () => {
    if (bookDetails.isbn.length !== 13) {
      setIsbnError(true);
      return;
    }
    setIsbnError(false);

    if (!isValidImageUri(bookDetails.imageUri)) {
      setImageUriError(true);
      return;
    }
    setImageUriError(false);

    if (isEditing) {
      handleEditBook(bookDetails);
    } else {
      handleAddBook(bookDetails);
    }
    handleCancel();
  };

  return (
    <ThemeProvider theme={theme}>
      <div>
        <form>
          <TextField
            label="Title"
            name="title"
            variant="outlined"
            fullWidth
            margin="normal"
            value={bookDetails.title}
            onChange={handleChange}
            inputProps={{ maxLength: maxTitleLength }}
            helperText={`Pozostałe znaki: ${
              maxTitleLength - bookDetails.title.length
            }`}
            required
            InputLabelProps={{
              sx: {
                color: "#9bc9db",
                "&:hover": {
                  color: "#89c7fa",
                },
              },
            }}
            InputProps={{
              sx: {
                color: "#ffffff",
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#89c7fa",
                },
              },
            }}
            FormHelperTextProps={{
              sx: {
                color: "#9bc9db",
              },
            }}
          />
          <Autocomplete
            options={authors.sort((a, b) =>
              a.authorName.localeCompare(b.authorName)
            )}
            getOptionLabel={(option) =>
              `${option.authorName} ${option.authorSurname}`
            }
            value={
              authors.find((author) => author.id === bookDetails.AuthorId) ||
              null
            }
            onChange={(_event, newValue) => {
              setBookDetails((prevState) => ({
                ...prevState,
                AuthorId: newValue ? newValue.id : null,
              }));
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Author"
                fullWidth
                required
                InputLabelProps={{
                  sx: {
                    color: "#9bc9db",
                  },
                }}
              />
            )}
          />
          <TextField
            label="Publisher"
            name="publisher"
            variant="outlined"
            fullWidth
            margin="normal"
            value={bookDetails.publisher}
            onChange={handleChange}
            inputProps={{ maxLength: maxPublisherLength }}
            helperText={`Pozostałe znaki: ${
              maxPublisherLength - bookDetails.publisher.length
            }`}
            required
            InputLabelProps={{
              sx: {
                color: "#9bc9db",
                "&:hover": {
                  color: "#89c7fa",
                },
              },
            }}
            InputProps={{
              sx: {
                color: "#ffffff",
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#89c7fa",
                },
              },
            }}
            FormHelperTextProps={{
              sx: {
                color: "#9bc9db",
              },
            }}
          />
          <TextField
            label="Genre"
            name="genre"
            variant="outlined"
            fullWidth
            margin="normal"
            value={bookDetails.genre}
            onChange={handleChange}
            inputProps={{ maxLength: maxGenreLength }}
            helperText={`Pozostałe znaki: ${
              maxGenreLength - bookDetails.genre.length
            }`}
            required
            InputLabelProps={{
              sx: {
                color: "#9bc9db",
                "&:hover": {
                  color: "#89c7fa",
                },
              },
            }}
            InputProps={{
              sx: {
                color: "#ffffff",
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#89c7fa",
                },
              },
            }}
            FormHelperTextProps={{
              sx: {
                color: "#9bc9db",
              },
            }}
          />
          <TextField
            label="Description"
            name="description"
            variant="outlined"
            fullWidth
            margin="normal"
            value={bookDetails.description}
            onChange={handleChange}
            inputProps={{ maxLength: maxDescriptionLength }}
            helperText={`Pozostałe znaki: ${
              maxDescriptionLength - bookDetails.description.length
            }`}
            required
            InputLabelProps={{
              sx: {
                color: "#9bc9db",
                "&:hover": {
                  color: "#89c7fa",
                },
              },
            }}
            InputProps={{
              sx: {
                color: "#ffffff",
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#89c7fa",
                },
              },
            }}
            FormHelperTextProps={{
              sx: {
                color: "#9bc9db",
              },
            }}
          />
          <TextField
            label="ISBN"
            name="isbn"
            variant="outlined"
            fullWidth
            margin="normal"
            type="text"
            value={bookDetails.isbn}
            onChange={handleChange}
            inputProps={{
              minLength: 13,
              maxLength: 13,
              onKeyPress: handleKeyPress,
              onPaste: handlePaste,
            }}
            helperText={
              isbnError
                ? "ISBN musi mieć 13 znaków"
                : `Pozostałe znaki: ${maxISBNLength - bookDetails.isbn.length}`
            }
            error={isbnError}
            required
            InputLabelProps={{
              sx: {
                color: "#9bc9db",
                "&:hover": {
                  color: "#89c7fa",
                },
              },
            }}
            InputProps={{
              sx: {
                color: "#ffffff",
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#89c7fa",
                },
              },
            }}
            FormHelperTextProps={{
              sx: {
                color: "#9bc9db",
              },
            }}
          />
          <TextField
            label="Pages Count"
            name="pagesCount"
            variant="outlined"
            fullWidth
            margin="normal"
            type="number"
            value={bookDetails.pagesCount}
            onChange={handleChange}
            inputProps={{
              min: minPagesCount,
              max: maxPagesCount,
              onKeyPress: handleKeyPress,
              onPaste: handlePaste,
            }}
            helperText={`Liczba stron powinna być między ${minPagesCount} i ${maxPagesCount}`}
            required
            InputLabelProps={{
              sx: {
                color: "#9bc9db",
                "&:hover": {
                  color: "#89c7fa",
                },
              },
            }}
            InputProps={{
              sx: {
                color: "#ffffff",
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#89c7fa",
                },
              },
            }}
            FormHelperTextProps={{
              sx: {
                color: "#9bc9db",
              },
            }}
          />
          <TextField
            label="Price"
            name="price"
            variant="outlined"
            fullWidth
            margin="normal"
            type="number"
            value={bookDetails.price}
            onChange={handleChange}
            inputProps={{
              max: maxPrice,
              onKeyPress: handleKeyPress,
              onPaste: handlePaste,
            }}
            helperText={`Cena powinna być mniejsza niż ${maxPrice}`}
            required
            InputLabelProps={{
              sx: {
                color: "#9bc9db",
                "&:hover": {
                  color: "#89c7fa",
                },
              },
            }}
            InputProps={{
              sx: {
                color: "#ffffff",
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#89c7fa",
                },
              },
            }}
            FormHelperTextProps={{
              sx: {
                color: "#9bc9db",
              },
            }}
          />
          <TextField
            label="Release Date"
            name="releaseDate"
            variant="outlined"
            fullWidth
            margin="normal"
            type="date"
            value={bookDetails.releaseDate}
            onChange={handleChange}
            required
            InputLabelProps={{
              shrink: true,
              sx: {
                color: "#9bc9db",
                "&:hover": {
                  color: "#89c7fa",
                },
              },
            }}
            InputProps={{
              sx: {
                color: "#ffffff",
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#89c7fa",
                },
              },
            }}
            FormHelperTextProps={{
              sx: {
                color: "#9bc9db",
              },
            }}
          />
          <TextField
            label="Image URI"
            name="imageUri"
            variant="outlined"
            fullWidth
            margin="normal"
            value={bookDetails.imageUri}
            onChange={handleChange}
            inputProps={{ maxLength: maxUriLength }}
            helperText={
              imageUriError
                ? "Nieprawidłowy URI obrazu"
                : `Pozostałe znaki: ${
                    maxUriLength - bookDetails.imageUri.length
                  }`
            }
            error={imageUriError}
            required
            InputLabelProps={{
              sx: {
                color: "#9bc9db",
                "&:hover": {
                  color: "#89c7fa",
                },
              },
            }}
            InputProps={{
              sx: {
                color: "#ffffff",
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#89c7fa",
                },
              },
            }}
            FormHelperTextProps={{
              sx: {
                color: "#9bc9db",
              },
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "1rem",
            }}
          >
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              {isEditing ? "Edytuj" : "Dodaj"}
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleCancel}
            >
              Anuluj
            </Button>
          </div>
        </form>
      </div>
    </ThemeProvider>
  );
};

export default BookForm;