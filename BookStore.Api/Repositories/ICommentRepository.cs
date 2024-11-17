using BookStore.Api.Entities;

namespace BookStore.Api.Repositories;

public interface ICommentRepository
{
    void Create(Comment comment);
    void Delete(int id);
    Comment? Get(int id);
    IEnumerable<Comment> GetAll();
    void Update(Comment updatedComment);
}
