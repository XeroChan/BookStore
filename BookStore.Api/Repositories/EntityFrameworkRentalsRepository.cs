using BookStore.Api.Data;
using BookStore.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace BookStore.Api.Repositories;

public class EntityFrameworkRentalsRepository : IRentalRepository
{
    private readonly BookStoreContext dbContext;
    private readonly ILogger<EntityFrameworkRentalsRepository> logger;

    public EntityFrameworkRentalsRepository(BookStoreContext dbContext, ILogger<EntityFrameworkRentalsRepository> logger)
    {
        this.dbContext = dbContext;
        this.logger = logger;
    }

    public async Task CreateAsync(Rental rental)
    {
        dbContext.Rentals.Add(rental);
        await dbContext.SaveChangesAsync();
        logger.LogInformation("Created rental {RentalDate} {DueDate} for book with id {BookId}", rental.RentalDate, rental.DueDate, rental.BookId);
    }

    public async Task DeleteAsync(int id)
    {
        await dbContext.Rentals.Where(rental => rental.Id == id)
            .ExecuteDeleteAsync();
        logger.LogInformation("Deleted rental with id {id}", id);
    }

    public async Task<Rental?> GetAsync(int id)
    {
        logger.LogInformation("Looking for rental with id {id}", id);
        return await dbContext.Rentals.FindAsync(id);
    }

    public async Task<IEnumerable<Rental>> GetAllAsync()
    {
        logger.LogInformation("Looking for rental list");
        return await dbContext.Rentals.AsNoTracking().ToListAsync();
    }

    public async Task UpdateAsync(Rental updatedRental)
    {
        dbContext.Update(updatedRental);
        await dbContext.SaveChangesAsync();
        logger.LogInformation("Successfully updated rental {RentalDate} {DueDate} for book with id {BookId} for client with id {ClientId}", updatedRental.RentalDate, updatedRental.DueDate, updatedRental.BookId, updatedRental.ClientId);
    }
}