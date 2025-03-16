using BookStore.Api.Entities;

namespace BookStore.Api.Repositories;

public class InMemCredentialRepository : ICredentialRepository
{
    private readonly List<Credential> credentials = new()
    {
        new Credential()
        {
            Id = 1,
            ClientId = 1,
            Username = "JanKovalsky45",
            Password = "jahnkofalskiy40@!",
            IsAdmin = false,
            IsAuthor = false
        },
        new Credential()
        {
            Id = 2,
            ClientId = 2,
            Username = "doeJonh245",
            Password = "d03j0hn!!",
            IsAdmin = false,
            IsAuthor = true
        }
    };
    public async Task<IEnumerable<Credential>> GetAllAsync()
    {
        return await Task.FromResult(credentials);
    }
    public async Task<Credential?> GetAsync(int id)
    {
        return await Task.FromResult(credentials.Find(client => client.Id == id));
    }
    public async Task CreateAsync(Credential credential)
    {
        credential.Id = credentials.Max(credential => credential.Id) + 1;
        credentials.Add(credential);

        await Task.CompletedTask;
    }
    public async Task UpdateAsync(Credential updatedCredential) // receives the client with updated parameters
    //from endpoint
    {
        // set the updatedClient in our list of clients
        var index = credentials.FindIndex(client => client.Id == updatedCredential.Id);
        credentials[index] = updatedCredential;

        await Task.CompletedTask;
    }
    public async Task DeleteAsync(int id)
    {
        var index = credentials.FindIndex(client => client.Id == id);
        credentials.RemoveAt(index);

        await Task.CompletedTask;
    }
    public Task<Credential?> GetByClientIdAsync(int clientId)
    {
        var credential = credentials.FirstOrDefault(c => c.ClientId == clientId);
        return Task.FromResult(credential);
    }
    public async Task<Credential?> GetByUsernameAsync(string username)
    {
        return await Task.FromResult(credentials.FirstOrDefault(c => c.Username == username));
    }
    public async Task<IEnumerable<Credential>> GetUsersWithAuthorFlagAsync()
    {
        return await Task.FromResult(credentials.Where(c => c.IsAuthor));
    }
}