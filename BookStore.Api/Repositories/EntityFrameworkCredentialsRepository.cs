using BookStore.Api.Data;
using BookStore.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace BookStore.Api.Repositories;

public class EntityFrameworkCredentialsRepository : ICredentialRepository
{
    private readonly BookStoreContext dbContext;
    private readonly ILogger<EntityFrameworkCredentialsRepository> logger;

    public EntityFrameworkCredentialsRepository(BookStoreContext dbContext, ILogger<EntityFrameworkCredentialsRepository> logger)
    {
        this.dbContext = dbContext;
        this.logger = logger;
    }

    public async Task CreateAsync(Credential credential)
    {
        dbContext.Credentials.Add(credential);
        await dbContext.SaveChangesAsync();
        logger.LogInformation("Created credential");
    }

    public async Task DeleteAsync(int id)
    {
        await dbContext.Credentials.Where(credential => credential.Id == id)
            .ExecuteDeleteAsync();
        logger.LogInformation("Deleted client with id {id}", id);
    }

    public async Task<Credential?> GetAsync(int id)
    {
        logger.LogInformation("Looking for credential with id {id}", id);
        return await dbContext.Credentials.FindAsync(id);
    }

    public async Task<IEnumerable<Credential>> GetAllAsync()
    {
        logger.LogInformation("Looking for credential list");
        return await dbContext.Credentials.AsNoTracking().ToListAsync();
    }

    public async Task UpdateAsync(Credential updatedCredential)
    {
        dbContext.Update(updatedCredential);
        await dbContext.SaveChangesAsync();
        logger.LogInformation("Successfully updated credential");
    }
}