using BookStore.Api.Data;
using BookStore.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace BookStore.Api.Repositories;

public class EntityFrameworkBooksRepository : IBooksRepository
{
    private readonly BookStoreContext dbContext;
    private readonly ILogger<EntityFrameworkBooksRepository> bookLogger;

    public EntityFrameworkBooksRepository(BookStoreContext dbContext, ILogger<EntityFrameworkBooksRepository> bookLogger)
    {
        this.dbContext = dbContext;
        this.bookLogger = bookLogger;
    }

    public async Task CreateAsync(Book book)
    {
        dbContext.Books.Add(book); // ask ef to keep track of the entity
        await dbContext.SaveChangesAsync(); // send changes into db

        bookLogger.LogInformation("Created book {Title} with ISBN {ISBN}", book.Title, book.ISBN); // structured logging useful to when querying the logs
    }

    public async Task DeleteAsync(int id)
    {
        await dbContext.Books.Where(book => book.Id == id)
            .ExecuteDeleteAsync();
        bookLogger.LogInformation("Deleted book with id {id}", id);
    }

    public async Task<Book?> GetAsync(int id)
    {
        bookLogger.LogInformation("Looking for book with id {id}", id);
        return await dbContext.Books.FindAsync(id);

    }

    public async Task<IEnumerable<Book>> GetAllAsync() // async + await - async approach for a method
    {
        bookLogger.LogInformation("Looking for book list");
        return await dbContext.Books.AsNoTracking().ToListAsync(); // no tracking of entity list
    }

    public async Task UpdateAsync(Book updatedBook)
    {
        dbContext.Update(updatedBook);
        await dbContext.SaveChangesAsync();
        bookLogger.LogInformation("Successfully updated book. Now titled {Title} with ISBN {ISBN}", updatedBook.Title, updatedBook.ISBN);
    }
}