using BookStore.Api.Authorization;
using BookStore.Api.Dtos;
using BookStore.Api.Entities;
using BookStore.Api.Repositories;

namespace BookStore.Api.Endpoints;

public static class BooksEndpoints //all extension methods are static
{
    const string GetGameV1EndpointName = "GetGameV1";
    const string GetGameV2EndpointName = "GetGameV2";

    public static RouteGroupBuilder MapBooksEndpoints(this IEndpointRouteBuilder routes) // do one more extension for that type just as MapGets etc
    {

        var group = routes.NewVersionedApi()
            .MapGroup("/books") // versioning
            .HasApiVersion(1.0)
            .HasApiVersion(2.0)
            .WithParameterValidation(); // group common paths, now routes invoke grouping

        // V1 GET ENDPOINTS
        group.MapGet("/", async (IBooksRepository repository) =>
        (await repository.GetAllAsync()).Select(book => book.AsDtoV1())) // retrive books, extends IEndpointRouteBuilder, we return not books but dtos
        .MapToApiVersion(1.0);

        group.MapGet("/{id}", async (IBooksRepository repository, int id) => // inject the repo as interface via dependency injection, books endpoints dont need to know the type of repo
        // just that theres an interface out there handling the connection with it
        {
            Book? book = await repository.GetAsync(id); // returning ok not book??

            return book is not null ? Results.Ok(book.AsDtoV1()) : Results.NotFound();
        })
        .WithName(GetGameV1EndpointName) // retrive game by id
        .MapToApiVersion(1.0);

        // V2 GET ENDPOINTS
        group.MapGet("/", async (IBooksRepository repository) =>
        (await repository.GetAllAsync()).Select(book => book.AsDtoV2())) // retrive books, extends IEndpointRouteBuilder, we return not books but dtos
        .MapToApiVersion(2.0);

        group.MapGet("/{id}", async (IBooksRepository repository, int id) => // inject the repo as interface via dependency injection, books endpoints dont need to know the type of repo
        // just that theres an interface out there handling the connection with it
        {
            Book? book = await repository.GetAsync(id); // returning ok not book??

            return book is not null ? Results.Ok(book.AsDtoV2()) : Results.NotFound();
        })
        .WithName(GetGameV2EndpointName) // retrive game by id
        .MapToApiVersion(2.0);

        group.MapPost("/", async (IBooksRepository repository, CreateBookDto bookDto) =>
        {
            Book book = new()
            {
                Title = bookDto.Title,
                AuthorId = bookDto.AuthorId,
                Publisher = bookDto.Publisher,
                Genre = bookDto.Genre,
                Description = bookDto.Description,
                ISBN = bookDto.ISBN,
                PagesCount = bookDto.PagesCount,
                Price = bookDto.Price,
                ReleaseDate = bookDto.ReleaseDate,
                ImageUri = bookDto.ImageUri
            };

            await repository.CreateAsync(book);

            return Results.CreatedAtRoute(GetGameV1EndpointName, new { id = book.Id }, book);
        })
        .RequireAuthorization(Policies.AdminAccess)
        .MapToApiVersion(1.0);

        group.MapPut("/{id}", async (IBooksRepository repository, int id, UpdateBookDto updatedBookDto) =>
        {
            Book? existingBook = await repository.GetAsync(id);

            if (existingBook is null) return Results.NotFound();

            existingBook.Title = updatedBookDto.Title;
            existingBook.Publisher = updatedBookDto.Publisher;
            existingBook.Genre = updatedBookDto.Genre;
            existingBook.Description = updatedBookDto.Description;
            existingBook.ISBN = updatedBookDto.ISBN;
            existingBook.PagesCount = updatedBookDto.PagesCount;
            existingBook.Price = updatedBookDto.Price;
            existingBook.ReleaseDate = updatedBookDto.ReleaseDate;
            existingBook.ImageUri = updatedBookDto.ImageUri;

            await repository.UpdateAsync(existingBook);

            return Results.NoContent();
        })
        .RequireAuthorization(Policies.AdminAccess)
        .MapToApiVersion(1.0);

        group.MapDelete("/{id}", async (IBooksRepository repository, int id) =>
        {
            Book? book = await repository.GetAsync(id);

            if (book is not null) await repository.DeleteAsync(id);

            return Results.NoContent();
        })
        .RequireAuthorization(Policies.AdminAccess)
        .MapToApiVersion(1.0);

        return group;
    }
}