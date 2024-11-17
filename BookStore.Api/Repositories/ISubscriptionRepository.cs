using BookStore.Api.Entities;

namespace BookStore.Api.Repositories;

public interface ISubscriptionRepository
{
    void Create(Subscription subscription);
    void Delete(int id);
    Subscription? Get(int id);
    IEnumerable<Subscription> GetAll();
}
