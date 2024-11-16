using System.ComponentModel.DataAnnotations;

namespace BookStore.Api.Entities;

public class Comment
{
    public int Id { get; set; }
    public int BookId { get; set; }
    public int CredentialId { get; set; }
    [Required]
    [StringLength(250)]
    public required string CommentString { get; set; }
    [Required]
    public int Rating { get; set; }
    // Navigation properties
    public Book? Book { get; set; }
    public Credential? Credential { get; set; }
}