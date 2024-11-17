using BookStore.Api.Entities;

namespace BookStore.Api.Repositories;

public interface IAuthorRepository
{
    Task CreateAsync(Author author);
    Task DeleteAsync(int id);
    Task<Author?> GetAsync(int id);
    Task<IEnumerable<Author>> GetAllAsync();
    Task UpdateAsync(Author updatedAuthor);
}
