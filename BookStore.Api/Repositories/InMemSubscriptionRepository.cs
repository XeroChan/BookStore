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
    public IEnumerable<Subscription> GetAll()
    {
        return subscriptions;
    }
    public Subscription? Get(int id)
    {
        return subscriptions.Find(author => author.Id == id);
    }
    public void Create(Subscription subscription)
    {
        subscription.Id = subscriptions.Max(subscription => subscription.Id) + 1;
        subscriptions.Add(subscription);
    }
    public void Delete(int id)
    {
        var index = subscriptions.FindIndex(subscription => subscription.Id == id);
        subscriptions.RemoveAt(index);
    }
}