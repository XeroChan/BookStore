using BookStore.Api.Entities;

namespace BookStore.Api.Repositories;

public class InMemCommentRepository
{
    private readonly List<Comment> comments = new()
    {
        new Comment()
        {
            Id = 1,
            BookId = 1,
            CredentialId = 1,
            CommentString = "Great book!",
            Rating = 4
        },
        new Comment()
        {
            Id = 2,
            BookId = 2,
            CredentialId = 1,
            CommentString = "Great too!",
            Rating = 5
        }
    };
    public IEnumerable<Comment> GetAll()
    {
        return comments;
    }
    public Comment? Get(int id)
    {
        return comments.Find(author => author.Id == id);
    }
    public void Create(Comment comment)
    {
        comment.Id = comments.Max(comment => comment.Id) + 1;
        comments.Add(comment);
    }
    public void Update(Comment updatedComment)
    {
        var index = comments.FindIndex(comment => comment.Id == updatedComment.Id);
        comments[index] = updatedComment;
    }
    public void Delete(int id)
    {
        var index = comments.FindIndex(author => author.Id == id);
        comments.RemoveAt(index);
    }
}