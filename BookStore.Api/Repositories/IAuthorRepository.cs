using BookStore.Api.Entities;

namespace BookStore.Api.Repositories;

public interface IAuthorRepository
{
    void Create(Author author);
    void Delete(int id);
    Author? Get(int id);
    IEnumerable<Author> GetAll();
    void Update(Author updatedAuthor);
}
