using BookStore.Api.Dtos;
using BookStore.Api.Entities;
using BookStore.Api.Repositories;

namespace BookStore.Api.Endpoints;

public static class AuthorEndpoints
{
    const string GetAuthorEndpointName = "GetAuthor";
    
    public static RouteGroupBuilder MapAuthorEndpoints(this IEndpointRouteBuilder routes)
    {
        var authorsGroup = routes.MapGroup("/authors").WithParameterValidation();
        authorsGroup.MapGet("/", (IAuthorRepository authorRepository) => authorRepository.GetAll().Select(author => author.AsDto()));
        authorsGroup.MapGet("/{id}", (IAuthorRepository authorRepository, int id) =>
        {
            Author? author = authorRepository.Get(id);
            return author is not null ? Results.Ok(author.AsDto()) : Results.NotFound();
        })
        .WithName(GetAuthorEndpointName);
        authorsGroup.MapPost("/", (IAuthorRepository authorRepository, CreateAuthorDto authorDto) =>
        {
            Author author = new()
            {
                AuthorName = authorDto.AuthorName,
                AuthorSurname = authorDto.AuthorSurname
            };
            authorRepository.Create(author);

            return Results.CreatedAtRoute(GetAuthorEndpointName, new { id = author.Id }, author);
        });
        authorsGroup.MapPut("/{id}", (IAuthorRepository authorRepository, int id, AuthorDto updatedAuthorDto) =>
        {
            Author? existingAuthor = authorRepository.Get(id);

            if (existingAuthor == null)
            {
                return Results.NotFound();
            }
            existingAuthor.AuthorName = updatedAuthorDto.AuthorName;
            existingAuthor.AuthorSurname = updatedAuthorDto.AuthorSurname;

            authorRepository.Update(existingAuthor);
            return Results.NoContent();
        });
        authorsGroup.MapDelete("/{id}", (IAuthorRepository authorRepository, int id) =>
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