using BookStore.Api.Authorization;
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
        authorsGroup.MapPost("/", async (IAuthorRepository authorRepository, ICredentialRepository credentialRepository, IClientRepository clientRepository, CreateAuthorsDto authorsDto) =>
        {
            if (authorsDto.UserIds == null || !authorsDto.UserIds.Any())
            {
                return Results.BadRequest("UserIds cannot be null or empty.");
            }

            foreach (var userId in authorsDto.UserIds)
            {
                var credential = await credentialRepository.GetAsync(userId);
                if (credential == null)
                {
                    return Results.BadRequest($"Credential with Id {userId} not found.");
                }

                var client = await clientRepository.GetAsync(credential.ClientId);
                if (client == null)
                {
                    return Results.BadRequest($"Client with Id {credential.ClientId} not found.");
                }

                Author author = new()
                {
                    CredentialId = userId,
                    AuthorName = client.Name,
                    AuthorSurname = client.Surname
                };
                await authorRepository.CreateAsync(author);
            }

            return Results.Ok();
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
        })
        .RequireAuthorization(Policies.AdminAccess);
        authorsGroup.MapDelete("/{id}", async (IAuthorRepository authorRepository, int id) =>
        {
            Author? author = await authorRepository.GetAsync(id);

            if (author is not null)
            {
                await authorRepository.DeleteAsync(id);
            }

            return Results.NoContent();
        })
        .RequireAuthorization(Policies.AdminAccess);
        return authorsGroup;
    }
}