using BookStore.Api.Entities;

namespace BookStore.Api.Repositories
{
    public interface ICredentialRepository
    {
        Task CreateAsync(Credential credential);
        Task DeleteAsync(int id);
        Task<Credential?> GetAsync(int id);
        Task<IEnumerable<Credential>> GetAllAsync();
        Task UpdateAsync(Credential updatedCredential);
        Task<Credential?> GetByClientIdAsync(int clientId);
        Task<Credential?> GetByUsernameAsync(string username);
        Task<IEnumerable<Credential>> GetUsersWithAuthorFlagAsync();
    }
}