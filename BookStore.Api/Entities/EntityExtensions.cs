using BookStore.Api.Dtos;

namespace BookStore.Api.Entities;

public static class EntityExtensions
{
    public static BookDtoV1 AsDtoV1(this Book book) // convert book entity to book Dto
    {
        return new BookDtoV1
        (
            book.Id,
            book.Title,
            book.AuthorId,
            book.Publisher,
            book.Genre,
            book.Description,
            book.ISBN,
            book.PagesCount,
            book.Price,
            book.ReleaseDate,
            book.ImageUri,
            book.DateAdded
        );
    }
    public static BookDtoV2 AsDtoV2(this Book book) // convert book entity to book Dto
    {
        return new BookDtoV2
        (
            book.Id,
            book.Title,
            book.AuthorId,
            book.Publisher,
            book.Genre,
            book.Description,
            book.ISBN,
            book.PagesCount,
            book.Price - (book.Price * .3m),
            book.Price,
            book.ReleaseDate,
            book.ImageUri,
            book.DateAdded
        );
    }
    public static ClientDto AsDto(this Client client)
    {
        return new ClientDto
        (
            client.Id,
            client.Name,
            client.Surname,
            client.Email,
            client.Telephone,
            client.Description ?? string.Empty
        );
    }
    public static CredentialDto AsDto(this Credential credential)
    {
        return new CredentialDto
        (
            credential.Id,
            credential.ClientId,
            credential.Username,
            credential.Password,
            credential.IsAdmin
        );
    }
    public static RentalDto AsDto(this Rental rental)
    {
        return new RentalDto
        (
            rental.Id,
            rental.ClientId,
            rental.BookId,
            rental.RentalDate,
            rental.DueDate
        );
    }
    public static AuthorDto AsDto(this Author author)
    {
        return new AuthorDto
        (
            author.Id,
            author.CredentialId,
            author.AuthorName,
            author.AuthorSurname
        );
    }
    public static CommentDto AsDto(this Comment comment)
    {
        return new CommentDto
        (
            comment.Id,
            comment.BookId,
            comment.CredentialId,
            comment.CommentString,
            comment.Rating
        );
    }
}