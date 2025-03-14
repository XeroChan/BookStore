using BookStore.Api.Entities;

namespace BookStore.Api.Repositories;

public class InMemClientsRepository : IClientRepository
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

    private readonly ICommentRepository commentRepository;
    private readonly ISubscriptionRepository subscriptionRepository;
    private readonly ICredentialRepository credentialRepository;
    private readonly IRentalRepository rentalRepository;

    public InMemClientsRepository(
        ICommentRepository commentRepository,
        ISubscriptionRepository subscriptionRepository,
        ICredentialRepository credentialRepository,
        IRentalRepository rentalRepository)
    {
        this.commentRepository = commentRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.credentialRepository = credentialRepository;
        this.rentalRepository = rentalRepository;
    }

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

    public async Task UpdateAsync(Client updatedClient)
    {
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

    public async Task<Client?> GetByEmailAsync(string email)
    {
        return await Task.FromResult(clients.FirstOrDefault(client => client.Email == email));
    }

    public async Task DeleteClientRelatedInfoAsync(int clientId)
    {
        var credential = await credentialRepository.GetByClientIdAsync(clientId);
        if (credential != null)
        {
            await rentalRepository.DeleteAsync(clientId);
            await commentRepository.DeleteAsync(credential.Id);
            await subscriptionRepository.DeleteAsync(credential.Id);
            await credentialRepository.DeleteAsync(credential.Id);
        }

        await Task.CompletedTask;
    }
}