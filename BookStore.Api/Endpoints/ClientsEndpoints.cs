using BookStore.Api.Authorization;
using BookStore.Api.Dtos;
using BookStore.Api.Entities;
using BookStore.Api.Repositories;

namespace BookStore.Api.Endpoints;

public static class ClientsEndpoints
{
    const string GetClientEndpointName = "GetClient";


    public static RouteGroupBuilder MapClientsEndpoints(this IEndpointRouteBuilder routes)
    {

        var clientGroup = routes.MapGroup("/clients").WithParameterValidation();
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
                Telephone = clientDto.Telephone
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

            await repository.UpdateAsync(existingClient);

            return Results.NoContent();
        })
        .RequireAuthorization(Policies.AdminAccess);

        clientGroup.MapDelete("/{id}", async (IClientRepository repository, int id) =>
        {
            Client? client = await repository.GetAsync(id);
            if (client is not null) await repository.DeleteAsync(id);

            return Results.NoContent();
        })
        .RequireAuthorization(Policies.AdminAccess);

        return clientGroup;
    }
}