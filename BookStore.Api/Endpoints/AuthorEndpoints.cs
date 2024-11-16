using BookStore.Api.Entities;
using BookStore.Api.Repositories;

namespace BookStore.Api.Endpoints;

public static class AuthorEndpoints
{
    const string GetAuthorEndpointName = "GetAuthor";
    
    public static RouteGroupBuilder MapAuthorEndpoints(this IEndpointRouteBuilder routes)
    {
        InMemAuthorRepository authorRepository = new();
        var authorsGroup = routes.MapGroup("/authors").WithParameterValidation();
        authorsGroup.MapGet("/", () => authorRepository.GetAll());
        authorsGroup.MapGet("/{id}", (int id) =>
        {
            Author? author = authorRepository.Get(id);
            return author is not null ? Results.Ok(author) : Results.NotFound();
        })
        .WithName(GetAuthorEndpointName);
        authorsGroup.MapPost("/", (Author author) =>
        {
            authorRepository.Create(author);

            return Results.CreatedAtRoute(GetAuthorEndpointName, new { id = author.Id }, author);
        });
        authorsGroup.MapPut("/{id}", (int id, Author updatedAuthor) =>
        {
            Author? existingAuthor = authorRepository.Get(id);

            if (existingAuthor == null)
            {
                return Results.NotFound();
            }
            existingAuthor.AuthorName = updatedAuthor.AuthorName;
            existingAuthor.AuthorSurname = updatedAuthor.AuthorSurname;

            authorRepository.Update(existingAuthor);
            return Results.NoContent();
        });
        authorsGroup.MapDelete("/{id}", (int id) =>
        {
            Author? author = authorRepository.Get(id);

            if (author is not null)
            {
                authorRepository.Delete(id);
            }

            return Results.NoContent();
        });
        return authorsGroup;
    }
}