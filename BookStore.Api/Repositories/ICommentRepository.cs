using BookStore.Api.Entities;

namespace BookStore.Api.Repositories;

public interface ICommentRepository
{
    Task CreateAsync(Comment comment);
    Task DeleteAsync(int id);
    Task<Comment?> GetAsync(int id);
    Task<IEnumerable<Comment>> GetAllAsync();
    Task<IEnumerable<Comment>> GetByUserIdAsync(int userId);
    Task<IEnumerable<Comment>> GetByBookIdAsync(int userId);
    Task UpdateAsync(Comment updatedComment);
}
