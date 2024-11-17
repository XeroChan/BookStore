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

    public IEnumerable<Subscription> GetAll()
    {
        return dbContext.Subscriptions.AsNoTracking().ToList(); 
    }

    public Subscription? Get(int id)
    {
        return dbContext.Subscriptions.Find(id);
    }

    public void Create(Subscription subscription)
    {
        dbContext.Subscriptions.Add(subscription);
        dbContext.SaveChanges();
    }

    public void Delete(int id)
    {
        dbContext.Subscriptions.Where(subscription => subscription.Id == id).ExecuteDelete();
    }
}