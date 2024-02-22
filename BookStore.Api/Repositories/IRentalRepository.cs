using BookStore.Api.Entities;

namespace BookStore.Api.Repositories
{
    public interface IRentalRepository
    {
        Task CreateAsync(Rental rental);
        Task DeleteAsync(int id);
        Task<Rental?> GetAsync(int id);
        Task<IEnumerable<Rental>> GetAllAsync();
        Task UpdateAsync(Rental updatedRental);
    }
}