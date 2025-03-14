using BookStore.Api.Authorization;
using BookStore.Api.Dtos;
using BookStore.Api.Entities;
using BookStore.Api.Repositories;
using BCrypt.Net;
using System.Text.Json;

namespace BookStore.Api.Endpoints;

public static class ClientsEndpoints
{
    const string GetClientEndpointName = "GetClient";


    public static RouteGroupBuilder MapClientsEndpoints(this IEndpointRouteBuilder routes)
    {

        var clientGroup = routes.MapGroup("/clients").WithParameterValidation();

        clientGroup.MapPost("/register", async (IClientRepository clientRepository, ICredentialRepository credentialRepository, UserRegistrationDto registrationDto) =>
        {
            // Check if the email or username already exists
            var existingClient = await clientRepository.GetByEmailAsync(registrationDto.Email);
            var existingCredential = await credentialRepository.GetByUsernameAsync(registrationDto.Username);

            if (existingClient != null || existingCredential != null)
            {
                return Results.BadRequest(new { Message = "An account with this email or username already exists." });
            }
            // Create the client
            Client client = new()
            {
                Name = registrationDto.Name,
                Surname = registrationDto.Surname,
                Email = registrationDto.Email,
                Telephone = registrationDto.Telephone
            };

            await clientRepository.CreateAsync(client);
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(registrationDto.Password);
            // Create the credential
            Credential credential = new()
            {
                ClientId = client.Id,
                Username = registrationDto.Username,
                Password = hashedPassword,
                IsAdmin = registrationDto.IsAdmin
            };

            await credentialRepository.CreateAsync(credential);

            return Results.Created($"/clients/{client.Id}", client);
        });

        clientGroup.MapGet("/", async (IClientRepository repository) =>
            (await repository.GetAllAsync()).Select(client => client.AsDto()));

        clientGroup.MapGet("/{id}", async (IClientRepository repository, int id) =>
        {
            Client? client = await repository.GetAsync(id);
            return client is not null ? Results.Ok(client.AsDto()) : Results.NotFound();
        })
        .WithName(GetClientEndpointName);

        clientGroup.MapPost("/", async (IClientRepository repository, CreateClientDto clientDto) =>
        {
            Client client = new()
            {
                Name = clientDto.Name,
                Surname = clientDto.Surname,
                Email = clientDto.Email,
                Telephone = clientDto.Telephone,
            };
            await repository.CreateAsync(client);
            return Results.CreatedAtRoute(GetClientEndpointName, new { id = client.Id }, client);
        });

        clientGroup.MapPut("/{id}", async (IClientRepository repository, int id, UpdateClientDto updatedClientDto) =>
        {
            Client? existingClient = await repository.GetAsync(id);
            if (existingClient is null) return Results.NotFound();

            existingClient.Name = updatedClientDto.Name;
            existingClient.Surname = updatedClientDto.Surname;
            existingClient.Email = updatedClientDto.Email;
            existingClient.Telephone = updatedClientDto.Telephone;
            existingClient.Description = updatedClientDto.Description;

            await repository.UpdateAsync(existingClient);

            return Results.NoContent();
        })
        .RequireAuthorization(Policies.AdminAccess);
        
        clientGroup.MapPut("/{id}/description", async (IClientRepository repository, int id, UpdateClientDescriptionDto updateClientDescriptionDto) =>
        {
            var client = await repository.GetAsync(id);
            if (client == null)
            {
                return Results.NotFound();
            }

            client.Description = updateClientDescriptionDto.Description;

            await repository.UpdateAsync(client);

            return Results.NoContent();
        });

        clientGroup.MapGet("/{id}/description", async (IClientRepository repository, int id) =>
        {
            var client = await repository.GetAsync(id);
            if (client == null)
            {
                return Results.NotFound();
            }
            return Results.Ok(new { Description = client.Description });
        });

        clientGroup.MapDelete("/{id}", async (IClientRepository repository, ICredentialRepository credentialRepository, int id, HttpContext httpContext) =>
        {

            Client? client = await repository.GetAsync(id);
            if (client is null)
            {
                return Results.NotFound();
            }

            Credential? credential = await credentialRepository.GetByClientIdAsync(id);
            if (credential is null || credential.IsAdmin)
            {
                return Results.Forbid();
            }

            // Read the password from the request body
            using var reader = new StreamReader(httpContext.Request.Body);
            var body = await reader.ReadToEndAsync();
            var data = JsonSerializer.Deserialize<Dictionary<string, string>>(body);
            if (data == null || !data.TryGetValue("password", out var password))
            {
                return Results.BadRequest("Password is required.");
            }

            // Verify the password
            if (!BCrypt.Net.BCrypt.Verify(password, credential.Password))
            {
                return Results.Forbid();
            }

            // Delete related information
            await repository.DeleteClientRelatedInfoAsync(id);

            // Delete the client
            await repository.DeleteAsync(id);

            return Results.NoContent();
        });

        return clientGroup;
    }
}