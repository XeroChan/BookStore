using BookStore.Api.Entities;

namespace BookStore.Api.Repositories;

public class InMemClientsRepository : IClientRepository

//data management
{
    private readonly List<Client> clients = new()
    {
        new Client()
        {
            Id = 1,
            Name = "Jan",
            Surname = "Kowalski",
            Email = "a@b.com",
            Telephone = "123456789"
        },
        new Client()
        {
            Id = 2,
            Name = "John",
            Surname = "Doe",
            Email = "b@c.com",
            Telephone = "789123456"
        }
    };
    public async Task<IEnumerable<Client>> GetAllAsync()
    {
        return await Task.FromResult(clients);
    }
    public async Task<Client?> GetAsync(int id)
    {
        return await Task.FromResult(clients.Find(client => client.Id == id));
    }
    public async Task CreateAsync(Client client)
    {
        client.Id = clients.Max(client => client.Id) + 1;
        clients.Add(client);

        await Task.CompletedTask;
    }
    public async Task UpdateAsync(Client updatedClient) // receives the client with updated parameters
    //from endpoint
    {
        // set the updatedClient in our list of clients
        var index = clients.FindIndex(client => client.Id == updatedClient.Id);
        clients[index] = updatedClient;

        await Task.CompletedTask;
    }
    public async Task DeleteAsync(int id)
    {
        var index = clients.FindIndex(client => client.Id == id);
        clients.RemoveAt(index);

        await Task.CompletedTask;
    }
}