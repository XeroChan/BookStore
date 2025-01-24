using BookStore.Api.Data;
using BookStore.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace BookStore.Api.Repositories;

public class EntityFrameworkCommentsRepository : ICommentRepository
{
    private readonly BookStoreContext dbContext;

    public EntityFrameworkCommentsRepository(BookStoreContext dbContext)
    {
        this.dbContext = dbContext;
    }

    public async Task<IEnumerable<Comment>> GetAllAsync()
    {
        return await dbContext.Comments.AsNoTracking().ToListAsync();
    }

    public async Task<Comment?> GetAsync(int id)
    {
        return await dbContext.Comments.FindAsync(id);
    }
    public async Task<IEnumerable<Comment>> GetByUserIdAsync(int userId)
    {
        return await dbContext.Comments
            .AsNoTracking()
            .Where(comment => comment.CredentialId == userId)
            .ToListAsync();
    }
    public async Task<IEnumerable<Comment>> GetByBookIdAsync(int bookId)
    {
        return await dbContext.Comments
            .AsNoTracking()
            .Where(comment => comment.BookId == bookId)
            .ToListAsync();
    }
    public async Task CreateAsync(Comment comment)
    {
        dbContext.Comments.Add(comment);
        await dbContext.SaveChangesAsync();
    }

    public async Task UpdateAsync(Comment updatedComment)
    {
        dbContext.Update(updatedComment);
        await dbContext.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        await dbContext.Comments.Where(comment => comment.Id == id).ExecuteDeleteAsync();
    }
}