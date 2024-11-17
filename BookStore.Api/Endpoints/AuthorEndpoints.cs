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
        authorsGroup.MapGet("/", async (IAuthorRepository authorRepository) => (await authorRepository.GetAllAsync()).Select(author => author.AsDto()));
        authorsGroup.MapGet("/{id}", async (IAuthorRepository authorRepository, int id) =>
        {
            Author? author = await authorRepository.GetAsync(id);
            return author is not null ? Results.Ok(author.AsDto()) : Results.NotFound();
        })
        .WithName(GetAuthorEndpointName);
        authorsGroup.MapPost("/", async (IAuthorRepository authorRepository, CreateAuthorDto authorDto) =>
        {
            Author author = new()
            {
                AuthorName = authorDto.AuthorName,
                AuthorSurname = authorDto.AuthorSurname
            };
            await authorRepository.CreateAsync(author);

            return Results.CreatedAtRoute(GetAuthorEndpointName, new { id = author.Id }, author);
        });
        authorsGroup.MapPut("/{id}", async (IAuthorRepository authorRepository, int id, AuthorDto updatedAuthorDto) =>
        {
            Author? existingAuthor = await authorRepository.GetAsync(id);

            if (existingAuthor == null)
            {
                return Results.NotFound();
            }
            existingAuthor.AuthorName = updatedAuthorDto.AuthorName;
            existingAuthor.AuthorSurname = updatedAuthorDto.AuthorSurname;

            await authorRepository.UpdateAsync(existingAuthor);
            return Results.NoContent();
        });
        authorsGroup.MapDelete("/{id}", async (IAuthorRepository authorRepository, int id) =>
        {
            Author? author = await authorRepository.GetAsync(id);

            if (author is not null)
            {
                await authorRepository.DeleteAsync(id);
            }

            return Results.NoContent();
        });
        return authorsGroup;
    }
}