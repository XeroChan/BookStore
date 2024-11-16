using BookStore.Api.Entities;

namespace BookStore.Api.Repositories;

public class InMemAuthorRepository
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
    public IEnumerable<Author> GetAll()
    {
        return authors;
    }
    public Author? Get(int id)
    {
        return authors.Find(author => author.Id == id);
    }
    public void Create(Author author)
    {
        author.Id = authors.Max(author => author.Id) + 1;
        authors.Add(author);
    }
    public void Update(Author updatedAuthor)
    {
        var index = authors.FindIndex(author => author.Id == updatedAuthor.Id);
        authors[index] = updatedAuthor;
    }
    public void Delete(int id)
    {
        var index = authors.FindIndex(author => author.Id == id);
        authors.RemoveAt(index);
    }
}