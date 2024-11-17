using BookStore.Api.Data;
using BookStore.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace BookStore.Api.Repositories;

public class EntityFrameworkSubscriptionRepository : ISubscriptionRepository
{
    private readonly BookStoreContext dbContext;

    public EntityFrameworkSubscriptionRepository(BookStoreContext dbContext)
    {
        this.dbContext = dbContext;
    }

    public async Task<IEnumerable<Subscription>> GetAllAsync()
    {
        return await dbContext.Subscriptions.AsNoTracking().ToListAsync();
    }

    public async Task<Subscription?> GetAsync(int id)
    {
        return await dbContext.Subscriptions.FindAsync(id);
    }

    public async Task CreateAsync(Subscription subscription)
    {
        dbContext.Subscriptions.Add(subscription);
        await dbContext.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        await dbContext.Subscriptions.Where(subscription => subscription.Id == id).ExecuteDeleteAsync();
    }
}