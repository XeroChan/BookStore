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

    public IEnumerable<Comment> GetAll()
    {
        return dbContext.Comments.AsNoTracking().ToList(); 
    }

    public Comment? Get(int id)
    {
        return dbContext.Comments.Find(id);
    }

    public void Create(Comment comment)
    {
        dbContext.Comments.Add(comment);
        dbContext.SaveChanges();
    }

    public void Update(Comment updatedComment)
    {
        dbContext.Update(updatedComment);
        dbContext.SaveChanges();
    }

    public void Delete(int id)
    {
        dbContext.Comments.Where(comment => comment.Id == id).ExecuteDelete();
    }
}