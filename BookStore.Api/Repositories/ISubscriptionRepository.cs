using BookStore.Api.Entities;

namespace BookStore.Api.Repositories;

public interface ISubscriptionRepository
{
    Task CreateAsync(Subscription subscription);
    Task DeleteAsync(int id);
    Task<Subscription?> GetAsync(int id);
    Task<IEnumerable<Subscription>> GetAllAsync();
    Task<IEnumerable<Subscription>> GetByUserIdAsync(int userId);
    Task<IEnumerable<Book>> GetNewPublicationsForCredentialAsync(int credentialId);
}
