using BookStore.Api.Entities;

namespace BookStore.Api.Repositories;

public class InMemSubscriptionRepository : ISubscriptionRepository
{
    private readonly List<Subscription> subscriptions = new()
    {
        new Subscription()
        {
            Id = 1,
            AuthorId = 1,
            CredentialId = 2

        },
        new Subscription()
        {
            Id = 2,
            AuthorId = 2,
            CredentialId = 1
        }
    };
    public async Task<IEnumerable<Subscription>> GetAllAsync()
    {
        return await Task.FromResult(subscriptions);
    }
    public async Task<Subscription?> GetAsync(int id)
    {
        return await Task.FromResult(subscriptions.Find(author => author.Id == id));
    }
    public async Task CreateAsync(Subscription subscription)
    {
        subscription.Id = subscriptions.Max(subscription => subscription.Id) + 1;
        subscriptions.Add(subscription);

        await Task.CompletedTask;
    }
    public async Task DeleteAsync(int id)
    {
        var index = subscriptions.FindIndex(subscription => subscription.Id == id);
        subscriptions.RemoveAt(index);

        await Task.CompletedTask;
    }
}