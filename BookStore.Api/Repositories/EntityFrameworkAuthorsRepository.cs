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

        public async Task<IEnumerable<Author>> GetAllAsync()
        {
            return await dbContext.Authors.AsNoTracking().ToListAsync();
        }

        public async Task<Author?> GetAsync(int id)
        {
            return await dbContext.Authors.FindAsync(id);
        }

        public async Task CreateAsync(Author author)
        {
            dbContext.Authors.Add(author);
            await dbContext.SaveChangesAsync();
        }

        public async Task UpdateAsync(Author updatedAuthor)
        {
            dbContext.Update(updatedAuthor);
            await dbContext.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            await dbContext.Authors.Where(author => author.Id == id).ExecuteDeleteAsync();
        }
    }
}