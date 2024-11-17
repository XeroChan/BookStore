using System.ComponentModel.DataAnnotations;

namespace BookStore.Api.Dtos;

public record BookDtoV1
(
    int Id,
    string Title,
    int AuthorId,
    string Publisher,
    string Genre,
    string Description,
    string ISBN,
    int PagesCount,
    decimal Price,
    DateTime ReleaseDate,
    string ImageUri
);

public record BookDtoV2
(
    int Id,
    string Title,
    int AuthorId,
    string Publisher,
    string Genre,
    string Description,
    string ISBN,
    int PagesCount,
    decimal Price,
    decimal RetailPrice,
    DateTime ReleaseDate,
    string ImageUri
);

public record CreateBookDto
(
    [Required][StringLength(100)] string Title,
    [Required] int AuthorId,
    [Required][StringLength(40)] string Publisher,
    [Required][StringLength(50)] string Genre,
    [Required][StringLength(800)] string Description,
    [Required][StringLength(13)] string ISBN,
    [Required][Range(1, 2000)] int PagesCount,
    [Required][Range(1, 200)] decimal Price,
    DateTime ReleaseDate,
    [Url][StringLength(250)] string ImageUri
);

public record UpdateBookDto
(
    [Required][StringLength(100)] string Title,
    [Required] int AuthorId,
    [Required][StringLength(40)] string Publisher,
    [Required][StringLength(50)] string Genre,
    [Required][StringLength(800)] string Description,
    [Required][StringLength(13)] string ISBN,
    [Required][Range(1, 2000)] int PagesCount,
    [Required][Range(1, 200)]
    decimal Price,
    DateTime ReleaseDate,
    [Url][StringLength(250)] string ImageUri
);

public record ClientDto
(
    int Id,
    string Name,
    string Surname,
    string Email,
    string Telephone
);

public record CreateClientDto
(
    [Required][StringLength(50)] string Name,
    [Required][StringLength(50)] string Surname,
    [Required][StringLength(100)][EmailAddress] string Email,
    [Required][StringLength(9)][Phone] string Telephone
);

public record UpdateClientDto
(
    [Required][StringLength(50)] string Name,
    [Required][StringLength(50)] string Surname,
    [Required][StringLength(100)][EmailAddress] string Email,
    [Required][StringLength(9)][Phone] string Telephone
);

public record CredentialDto
(
    int Id,
    int ClientId,
    string Username,
    string Password,
    bool IsAdmin
);

public record CreateCredentialDto
(
    int ClientId,
    [Required][StringLength(20)] string Username,
    [Required][StringLength(20)]
    string Password,
    bool IsAdmin
);

public record UpdateCredentialDto
(
    int ClientId,
    [Required][StringLength(20)] string Username,
    [Required][StringLength(20)] string Password,
    bool IsAdmin
);

public record RentalDto
(
    int Id,
    int ClientId,
    int BookId,
    DateTime RentalDate,
    DateTime DueDate
);

public record CreateRentalDto
(
    int ClientId,
    int BookId,
    DateTime RentalDate,
    DateTime DueDate
);

public record UpdateRentalDto
(
    int ClientId,
    int BookId,
    DateTime RentalDate,
    DateTime DueDate
);

public record AuthorDto
(
    int Id,
    int CredentialId,
    [Required][StringLength(60)] string AuthorName,
    [Required][StringLength(60)] string AuthorSurname
);

public record CreateAuthorDto
(
    [Required][StringLength(60)] string AuthorName,
    [Required][StringLength(60)] string AuthorSurname
);

public record UpdateAuthorDto
(
    [Required][StringLength(60)] string AuthorName,
    [Required][StringLength(60)] string AuthorSurname
);

public record CommentDto
(
    int Id,
    int BookId,
    int CredentialId,
    [Required][StringLength(250)] string CommentString,
    [Required] int Rating
);

public record CreateCommentDto
(
    [Required][StringLength(250)] string CommentString,
    [Required] int Rating
);

public record UpdateCommentDto
(
    [Required][StringLength(250)] string CommentString,
    [Required] int Rating
);