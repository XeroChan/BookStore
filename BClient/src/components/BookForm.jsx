import React, { useEffect } from 'react';
import { TextField, Button, ThemeProvider, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const BookForm = ({
    bookDetails,
    setBookDetails,
    isEditing,
    handleAddBook,
    handleEditBook,
    authors,
    theme,
    handleCancel
}) => {
    useEffect(() => {
        if (isEditing && bookDetails) {
            // Ensure releaseDate is in the correct format
            if (bookDetails.releaseDate) {
                const formattedDate = new Date(bookDetails.releaseDate).toISOString().split('T')[0];
                setBookDetails((prevState) => ({
                    ...prevState,
                    releaseDate: formattedDate,
                }));
            }
        }
    }, [isEditing, bookDetails, setBookDetails]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBookDetails((prevState) => ({
            ...prevState,
            [name]: name === 'pagesCount' || name === 'price' ? Number(value) : value,
        }));
    };

    const handleSelectChange = (e) => {
        setBookDetails((prevState) => ({
            ...prevState,
            authorId: e.target.value,
        }));
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

    const handleSubmit = () => {
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
                        helperText={`Remaining characters: ${maxTitleLength - bookDetails.title.length}`}
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="author-label">Author</InputLabel>
                        <Select
                            labelId="author-label"
                            name="authorId"
                            value={bookDetails.authorId || ''}
                            onChange={handleSelectChange}
                        >
                            {authors.map(author => (
                                <MenuItem key={author.id} value={author.id}>
                                    {author.authorName} {author.authorSurname}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        label="Publisher"
                        name="publisher"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={bookDetails.publisher}
                        onChange={handleChange}
                        inputProps={{ maxLength: maxPublisherLength }}
                        helperText={`Remaining characters: ${maxPublisherLength - bookDetails.publisher.length}`}
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
                        helperText={`Remaining characters: ${maxGenreLength - bookDetails.genre.length}`}
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
                        helperText={`Remaining characters: ${maxDescriptionLength - bookDetails.description.length}`}
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
                        inputProps={{ maxLength: maxISBNLength }}
                        helperText={`Remaining characters: ${maxISBNLength - bookDetails.isbn.length}`}
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
                        inputProps={{ min: minPagesCount, max: maxPagesCount }}
                        helperText={`Pages count should be between ${minPagesCount} and ${maxPagesCount}`}
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
                        inputProps={{ max: maxPrice }}
                        helperText={`Price should be less than ${maxPrice}`}
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
                        InputLabelProps={{ shrink: true }}
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
                        helperText={`Remaining characters: ${maxUriLength - bookDetails.imageUri.length}`}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                        <Button variant="contained" color="primary" onClick={handleSubmit}>
                            {isEditing ? 'Edit Book' : 'Add Book'}
                        </Button>
                        <Button variant="contained" color="secondary" onClick={handleCancel}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </ThemeProvider>
    );
};

export default BookForm;