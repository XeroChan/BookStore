using BookStore.Api.Entities;

namespace BookStore.Api.Repositories;

public class InMemCommentRepository : ICommentRepository
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
    public async Task<IEnumerable<Comment>> GetAllAsync()
    {
        return await Task.FromResult(comments);
    }
    public async Task<Comment?> GetAsync(int id)
    {
        return await Task.FromResult(comments.Find(comment => comment.Id == id));
    }
    public async Task CreateAsync(Comment comment)
    {
        comment.Id = comments.Max(comment => comment.Id) + 1;
        comments.Add(comment);

        await Task.CompletedTask;
    }
    public async Task UpdateAsync(Comment updatedComment)
    {
        var index = comments.FindIndex(comment => comment.Id == updatedComment.Id);
        comments[index] = updatedComment;

        await Task.CompletedTask;
    }
    public async Task DeleteAsync(int id)
    {
        var index = comments.FindIndex(comment => comment.Id == id);
        comments.RemoveAt(index);

        await Task.CompletedTask;
    }
}