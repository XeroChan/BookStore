using System.ComponentModel.DataAnnotations;

namespace BookStore.Api.Entities;

public class Author
{
    public int Id { get; set; }
    public int CredentialId { get; set; }
    [Required]
    [StringLength(60)]
    public required string AuthorName { get; set; }
    [Required]
    [StringLength(60)]
    public required string AuthorSurname { get; set; }
    // Navigation properties
    public Credential? Credential { get; set; }
}