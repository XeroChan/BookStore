using BookStore.Api.Entities;

namespace BookStore.Api.Repositories
{
    public interface IBooksRepository
    {
        Task CreateAsync(Book book);
        Task DeleteAsync(int id);
        Task<Book?> GetAsync(int id);
        Task<IEnumerable<Book>> GetAllAsync();
        Task UpdateAsync(Book updatedBook); // async approach with Task
    }
}