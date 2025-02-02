using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookStore.Api.Entities;

public class Credential
{
    public int Id { get; set; }
    [Required]
    [Column("client_id")]
    public int ClientId { get; set; }
    [Required]
    [StringLength(20)]
    public required string Username { get; set; }
    [Required]
    [StringLength(100)]
    public required string Password { get; set; }
    [Column("is_admin")]
    public bool IsAdmin { get; set; }
    [Column("is_author")]
    public bool IsAuthor { get; set; }
    // Navigation property
    public Client? Client { get; set; }

}