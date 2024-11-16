using System.Text.RegularExpressions;
using BookStore.Api.Entities;

namespace BookStore.Api.Endpoints;

public static class AuthorEndpoints
{
    const string GetAuthorEndpointName = "GetAuthor";
    static List<Author> authors = new()
{
    new Author()
    {
        Id = 1,
        CredentialId = 3,
        AuthorName = "Edgar",
        AuthorSurname = "Nowy",

    },
    new Author()
    {
        Id = 2,
        CredentialId = 2,
        AuthorName = "Marek",
        AuthorSurname = "Stary",
    }
};
    public static RouteGroupBuilder MapAuthorEndpoints(this IEndpointRouteBuilder routes)
    {
        var authorsGroup = routes.MapGroup("/authors").WithParameterValidation();
        authorsGroup.MapGet("/", () => authors);
        authorsGroup.MapGet("/{id}", (int id) =>
        {
            Author? author = authors.Find(author => author.Id == id);

            if (author == null)
            {
                return Results.NotFound();
            }
            return Results.Ok(author);
        })
        .WithName(GetAuthorEndpointName);
        authorsGroup.MapPost("/", (Author author) =>
        {
            author.Id = authors.Max(author => author.Id) + 1;
            authors.Add(author);

            return Results.CreatedAtRoute(GetAuthorEndpointName, new { id = author.Id }, author);
        });
        authorsGroup.MapPut("/{id}", (int id, Author updatedAuthor) =>
        {
            Author? existingAuthor = authors.Find(author => author.Id == id);

            if (existingAuthor == null)
            {
                return Results.NotFound();
            }
            existingAuthor.AuthorName = updatedAuthor.AuthorName;
            existingAuthor.AuthorSurname = updatedAuthor.AuthorSurname;

            return Results.NoContent();
        });
        authorsGroup.MapDelete("/{id}", (int id) =>
        {
            Author? author = authors.Find(author => author.Id == id);

            if (author is not null)
            {
                authors.Remove(author);
            }

            return Results.NoContent();
        });
        return authorsGroup;
    }
}