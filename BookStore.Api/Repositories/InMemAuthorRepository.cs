using BookStore.Api.Entities;

namespace BookStore.Api.Repositories;

public class InMemAuthorRepository : IAuthorRepository
{
    private readonly List<Author> authors = new()
    {
        new Author()
        {
            Id = 1,
            CredentialId = 3,
            AuthorName = "Edgar",
            AuthorSurname = "Nowy",

        },
        new Author()
        {
            Id = 2,
            CredentialId = 2,
            AuthorName = "Marek",
            AuthorSurname = "Stary",
        }
    };
    public async Task<IEnumerable<Author>> GetAllAsync()
    {
        return await Task.FromResult(authors);
    }
    public async Task<Author?> GetAsync(int id)
    {
        return await Task.FromResult(authors.Find(author => author.Id == id));
    }
    public async Task CreateAsync(Author author)
    {
        author.Id = authors.Max(author => author.Id) + 1;
        authors.Add(author);

        await Task.CompletedTask;
    }
    public async Task UpdateAsync(Author updatedAuthor)
    {
        var index = authors.FindIndex(author => author.Id == updatedAuthor.Id);
        authors[index] = updatedAuthor;

        await Task.CompletedTask;
    }
    public async Task DeleteAsync(int id)
    {
        var index = authors.FindIndex(author => author.Id == id);
        authors.RemoveAt(index);

        await Task.CompletedTask;
    }
}