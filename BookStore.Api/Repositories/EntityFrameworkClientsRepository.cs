using BookStore.Api.Data;
using BookStore.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace BookStore.Api.Repositories;

public class EntityFrameworkClientsRepository : IClientRepository
{
    private readonly BookStoreContext dbContext;
    private readonly ILogger<EntityFrameworkClientsRepository> logger;

    public EntityFrameworkClientsRepository(BookStoreContext dbContext, ILogger<EntityFrameworkClientsRepository> logger)
    {
        this.dbContext = dbContext;
        this.logger = logger;
    }

    public async Task CreateAsync(Client client)
    {
        dbContext.Clients.Add(client);
        await dbContext.SaveChangesAsync();
        logger.LogInformation("Created client {Name} {Surname}", client.Name, client.Surname);
    }

    public async Task DeleteAsync(int id)
    {
        await dbContext.Clients.Where(client => client.Id == id)
            .ExecuteDeleteAsync();
        logger.LogInformation("Deleted client with id {id}", id);
    }

    public async Task<Client?> GetAsync(int id)
    {
        logger.LogInformation("Looking for client with id {id}", id);
        return await dbContext.Clients.FindAsync(id);
    }

    public async Task<IEnumerable<Client>> GetAllAsync()
    {
        logger.LogInformation("Looking for client list");
        return await dbContext.Clients.AsNoTracking().ToListAsync();
    }

    public async Task<Credential?> GetByClientIdAsync(int clientId)
    {
        return await dbContext.Credentials.FirstOrDefaultAsync(c => c.ClientId == clientId);
    }

    public async Task UpdateAsync(Client updatedClient)
    {
        dbContext.Update(updatedClient);
        await dbContext.SaveChangesAsync();
        logger.LogInformation("Successfully updated client {Name} {Surname}. Email {Email}, Telephone {Telephone}", updatedClient.Name, updatedClient.Surname, updatedClient.Email, updatedClient.Telephone);
    }
}