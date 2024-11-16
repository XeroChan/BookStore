namespace BookStore.Api.Entities;

public class Subscription
{
    public int Id { get; set; }
    public int AuthorId { get; set; }
    public int CredentialId { get; set; }
    // Navigation properties
    public Author? Author { get; set; }
    public Credential? Credential { get; set; }
}