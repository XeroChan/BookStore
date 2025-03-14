using BookStore.Api.Entities;

namespace BookStore.Api.Repositories
{
    public interface IClientRepository
    {
        Task CreateAsync(Client client);
        Task DeleteAsync(int id);
        Task<Client?> GetAsync(int id);
        Task<IEnumerable<Client>> GetAllAsync();
        Task UpdateAsync(Client updatedClient);
        Task<Client?> GetByEmailAsync(string email);
        Task DeleteClientRelatedInfoAsync(int id);
    }
}