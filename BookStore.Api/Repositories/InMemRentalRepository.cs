using BookStore.Api.Entities;

namespace BookStore.Api.Repositories;

public class InMemRentalRepository : IRentalRepository
{
    private readonly List<Rental> rentals = new()
    {
        new Rental()
        {
            Id = 1,
            ClientId = 1,
            BookId = 1,
            RentalDate = new DateTime(2024, 2, 20),
            DueDate = new DateTime(2024, 2, 21)
        },
        new Rental()
        {
            Id = 2,
            ClientId = 2,
            BookId = 3,
            RentalDate = new DateTime(2024, 1, 15),
            DueDate = new DateTime(2024, 2, 4)
        }
    };
    public async Task<IEnumerable<Rental>> GetAllAsync()
    {
        return await Task.FromResult(rentals);
    }
    public async Task<Rental?> GetAsync(int id)
    {
        return await Task.FromResult(rentals.Find(rental => rental.Id == id));
    }
    public async Task CreateAsync(Rental rental)
    {
        rental.Id = rentals.Max(rental => rental.Id) + 1;
        rentals.Add(rental);

        await Task.CompletedTask;
    }
    public async Task UpdateAsync(Rental updatedRental) // receives the client with updated parameters
    //from endpoint
    {
        // set the updatedClient in our list of clients
        var index = rentals.FindIndex(rental => rental.Id == updatedRental.Id);
        rentals[index] = updatedRental;

        await Task.CompletedTask;
    }
    public async Task DeleteAsync(int id)
    {
        var index = rentals.FindIndex(rental => rental.Id == id);
        rentals.RemoveAt(index);

        await Task.CompletedTask;
    }
    public async Task DeleteByClientIdAsync(int clientId)
    {
        rentals.RemoveAll(r => r.ClientId == clientId);
        await Task.CompletedTask;
    }
}