import React from 'react';
import { TextField, Button, ThemeProvider } from '@mui/material';

const BookForm = ({
    bookDetails,
    setBookDetails,
    showAddBookForm,
    isEditing,
    handleAddBook,
    handleEditBook,
    setShowAddBookForm,
    theme
}) =>
{
    const handleChange = (e) =>
    {
        setBookDetails((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const maxTitleLength = 100;
    const maxAuthorLength = 30;
    const maxPublisherLength = 40;
    const maxGenreLength = 50;
    const maxDescriptionLength = 800;
    const maxISBNLength = 13;
    const minPagesCount = 1;
    const maxPagesCount = 2000;
    const maxPrice = 200;
    const maxUriLength = 250;

    return (
        <ThemeProvider theme={theme}>
            <div>
                <form>
                    <TextField
                        label="Tytuł"
                        name="title"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={showAddBookForm ? bookDetails.title : ''}
                        onChange={handleChange}
                        inputProps={{ maxLength: maxTitleLength }}
                        helperText={`Remaining characters: ${maxTitleLength - bookDetails.title.length}`}
                    />
                    <TextField
                        label="Autor"
                        name="author"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={showAddBookForm ? bookDetails.author : ''}
                        onChange={handleChange}
                        inputProps={{ maxLength: maxAuthorLength }}
                        helperText={`Remaining characters: ${maxAuthorLength - bookDetails.author.length}`}
                    />
                    <TextField
                        label="Publisher"
                        name="publisher"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={showAddBookForm ? bookDetails.publisher : ''}
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
                        value={showAddBookForm ? bookDetails.genre : ''}
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
                        value={showAddBookForm ? bookDetails.description : ''}
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
                        value={showAddBookForm ? bookDetails.isbn : ''}
                        onChange={(e) =>
                        {
                            setBookDetails((prevState) => ({
                                ...prevState,
                                [e.target.name]: e.target.value,
                            }));
                            const inputValue = e.target.value;
                            const numericValue = inputValue.replace(/[^0-9]/g, '');
                            const limitedValue = numericValue.slice(0, 13);
                            setBookDetails({ ...bookDetails, isbn: limitedValue });
                        }}
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
                        value={showAddBookForm ? bookDetails.pagesCount : ''}
                        onChange={(e) =>
                        {
                            setBookDetails((prevState) => ({
                                ...prevState,
                                [e.target.name]: e.target.value,
                            }));
                            const value = parseInt(e.target.value, 10);
                            if (!isNaN(value))
                            {
                                setBookDetails({ ...bookDetails, pagesCount: value });
                            }
                        }}
                        inputProps={{ max: maxPagesCount, min: minPagesCount }}
                        helperText={`Minimum Pages Count: ${minPagesCount}. Pages until limit: ${maxPagesCount - bookDetails.pagesCount}`}
                    />
                    <TextField
                        label="Cena"
                        name="price"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        type="number"
                        value={showAddBookForm ? bookDetails.price : ''}
                        onChange={(e) =>
                        {
                            const value = parseFloat(e.target.value);
                            if (!isNaN(value) && value <= maxPrice)
                            {
                                setBookDetails((prevState) => ({
                                    ...prevState,
                                    [e.target.name]: value,
                                }));
                            }
                        }}
                        inputProps={{ max: maxPrice }}
                        helperText={`Remaining value before reaching maximum price: ${maxPrice - bookDetails.price}`}
                    />
                    <TextField
                        label="Release Date"
                        name="releaseDate"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        type="date"
                        value={showAddBookForm ? bookDetails.releaseDate : ''}
                        onChange={handleChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        label="ImageUri"
                        name="imageUri"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={showAddBookForm ? bookDetails.imageUri : ''}
                        onChange={handleChange}
                        inputProps={{ maxLength: maxUriLength }}
                        helperText={`Remaining characters: ${maxUriLength - bookDetails.imageUri.length}`}
                    />
                    {/* Buttons */}
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={isEditing ? handleEditBook : handleAddBook}
                        style={{ marginRight: '10px' }}
                    >
                        {isEditing ? 'Save Changes' : 'Dodaj książkę'}
                    </Button>

                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() =>
                        {
                            setShowAddBookForm(false);
                            setBookDetails({
                                id: 0,
                                title: '',
                                author: '',
                                publisher: '',
                                genre: '',
                                description: '',
                                isbn: '',
                                pagesCount: 0,
                                price: 0,
                                releaseDate: '',
                                imageUri: '',
                            });
                        }}
                    >
                        Anuluj
                    </Button>
                </form>
            </div>
        </ThemeProvider>
    );
};

export default BookForm;
