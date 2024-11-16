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
            book.ImageUri
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
            book.ImageUri
        );
    }
    public static ClientDto AsDto(this Client client) // convert book entity to book Dto
    {
        return new ClientDto
        (
            client.Id,
            client.Name,
            client.Surname,
            client.Email,
            client.Telephone
        );
    }
    public static CredentialDto AsDto(this Credential credential) // convert book entity to book Dto
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
    public static RentalDto AsDto(this Rental rental) // convert book entity to book Dto
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
}