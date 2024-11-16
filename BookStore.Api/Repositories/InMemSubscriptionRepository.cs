using BookStore.Api.Entities;

namespace BookStore.Api.Repositories;

public class InMemSubscriptionRepository
{
    private readonly List<Subscription> subscriptions = new()
    {
        new Subscription()
        {
            Id = 1,
            AuthorId = 1,
            CredentialId = 2

        },
        new Subscription()
        {
            Id = 2,
            AuthorId = 2,
            CredentialId = 1
        }
    };
    public IEnumerable<Subscription> GetAll()
    {
        return subscriptions;
    }
    public Subscription? Get(int id)
    {
        return subscriptions.Find(author => author.Id == id);
    }
    public void Create(Subscription comment)
    {
        comment.Id = subscriptions.Max(comment => comment.Id) + 1;
        subscriptions.Add(comment);
    }
    public void Update(Subscription updatedComment)
    {
        var index = subscriptions.FindIndex(comment => comment.Id == updatedComment.Id);
        subscriptions[index] = updatedComment;
    }
    public void Delete(int id)
    {
        var index = subscriptions.FindIndex(author => author.Id == id);
        subscriptions.RemoveAt(index);
    }
}