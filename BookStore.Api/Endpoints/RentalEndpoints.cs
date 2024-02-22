using BookStore.Api.Authorization;
using BookStore.Api.Dtos;
using BookStore.Api.Entities;
using BookStore.Api.Repositories;

namespace BookStore.Api.Endpoints;

public static class RentalEndpoints
{
    const string GetRentalEndpointName = "GetRental";

    public static RouteGroupBuilder MapRentalsEndpoints(this IEndpointRouteBuilder routes)
    {

        var rentalGroup = routes.MapGroup("/rentals").WithParameterValidation();
        rentalGroup.MapGet("/", async (IRentalRepository repository) =>
            (await repository.GetAllAsync()).Select(rental => rental.AsDto()));

        rentalGroup.MapGet("/{id}", async (IRentalRepository repository, int id) =>
        {
            Rental? rental = await repository.GetAsync(id);
            return rental is not null ? Results.Ok(rental.AsDto()) : Results.NotFound();
        })
        .WithName(GetRentalEndpointName);

        rentalGroup.MapPost("/", async (IRentalRepository repository, CreateRentalDto rentalDto) =>
        {
            Rental rental = new()
            {
                ClientId = rentalDto.ClientId,
                BookId = rentalDto.BookId,
                RentalDate = rentalDto.RentalDate,
                DueDate = rentalDto.DueDate
            };
            await repository.CreateAsync(rental);
            return Results.CreatedAtRoute(GetRentalEndpointName, new { id = rental.Id }, rental);
        }).RequireAuthorization(Policies.ClientWriteAccess);

        rentalGroup.MapPut("/{id}", async (IRentalRepository repository, int id, UpdateRentalDto updatedRentalDto) =>
        {
            Rental? existingRental = await repository.GetAsync(id);
            if (existingRental is null) return Results.NotFound();

            existingRental.ClientId = updatedRentalDto.ClientId;
            existingRental.BookId = updatedRentalDto.BookId;
            existingRental.RentalDate = updatedRentalDto.RentalDate;
            existingRental.DueDate = updatedRentalDto.DueDate;

            await repository.UpdateAsync(existingRental);

            return Results.NoContent();
        })
        .RequireAuthorization(Policies.AdminAccess);

        rentalGroup.MapDelete("/{id}", async (IRentalRepository repository, int id) =>
        {
            Rental? rental = await repository.GetAsync(id);
            if (rental is not null) await repository.DeleteAsync(id);

            return Results.NoContent();
        }).RequireAuthorization(Policies.AdminAccess);

        return rentalGroup;
    }
}