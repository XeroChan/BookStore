using BookStore.Api.Data;
using BookStore.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace BookStore.Api.Repositories
{
    public class EntityFrameworkAuthorsRepository : IAuthorRepository
    {
        private readonly BookStoreContext dbContext;

        public EntityFrameworkAuthorsRepository(BookStoreContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public IEnumerable<Author> GetAll()
        {
            return dbContext.Authors.AsNoTracking().ToList();
        }

        public Author? Get(int id)
        {
            return dbContext.Authors.Find(id);
        }

        public void Create(Author author)
        {
            dbContext.Authors.Add(author);
            dbContext.SaveChanges();
        }

        public void Update(Author updatedAuthor)
        {
            dbContext.Update(updatedAuthor);
            dbContext.SaveChanges();
        }

        public void Delete(int id)
        {
            dbContext.Authors.Where(author => author.Id == id).ExecuteDelete();
        }
    }
}