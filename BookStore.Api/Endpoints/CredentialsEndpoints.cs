using BookStore.Api.Authorization;
using BookStore.Api.Dtos;
using BookStore.Api.Entities;
using BookStore.Api.Repositories;

namespace BookStore.Api.Endpoints;

public static class CredentialsEndpoints
{
    const string GetCredentialsEndpointName = "GetCredentials";


    public static RouteGroupBuilder MapCredentialsEndpoints(this IEndpointRouteBuilder routes)
    {

        var credentialGroup = routes.MapGroup("/credentials").WithParameterValidation();
        credentialGroup.MapGet("/", async (ICredentialRepository repository) =>
            (await repository.GetAllAsync()).Select(credential => credential.AsDto()));

        credentialGroup.MapGet("/{id}", async (ICredentialRepository repository, int id) =>
        {
            Credential? credential = await repository.GetAsync(id);
            return credential is not null ? Results.Ok(credential.AsDto()) : Results.NotFound();
        })
        .WithName(GetCredentialsEndpointName);

        credentialGroup.MapPost("/", async (ICredentialRepository repository, CreateCredentialDto credentialDto) =>
        {
            Credential credential = new()
            {
                ClientId = credentialDto.ClientId,
                Username = credentialDto.Username,
                Password = credentialDto.Password,
                IsAdmin = credentialDto.IsAdmin
            };
            await repository.CreateAsync(credential);
            return Results.CreatedAtRoute(GetCredentialsEndpointName, new { id = credential.Id }, credential);
        });

        credentialGroup.MapPut("/{id}", async (ICredentialRepository repository, int id, UpdateCredentialDto updatedCredentialDto) =>
        {
            Credential? existingCredential = await repository.GetAsync(id);
            if (existingCredential is null) return Results.NotFound();
            existingCredential.ClientId = updatedCredentialDto.ClientId;
            existingCredential.Username = updatedCredentialDto.Username;
            existingCredential.Password = updatedCredentialDto.Password;

            await repository.UpdateAsync(existingCredential);

            return Results.NoContent();
        })
        .RequireAuthorization(Policies.AdminAccess);

        credentialGroup.MapDelete("/{id}", async (ICredentialRepository repository, int id) =>
        {
            Credential? credential = await repository.GetAsync(id);
            if (credential is not null) await repository.DeleteAsync(id);

            return Results.NoContent();
        })
        .RequireAuthorization(Policies.AdminAccess);

        return credentialGroup;
    }
}