using System.ComponentModel.DataAnnotations;

namespace BookStore.Api.Entities;

public class Client
{
    public int Id { get; set; }
    [Required]
    [StringLength(50)]
    public required string Name { get; set; }
    [Required]
    [StringLength(50)]
    public required string Surname { get; set; }
    [Required]
    [StringLength(100)]
    [EmailAddress]
    public required string Email { get; set; }
    [Required]
    [StringLength(9)]
    [Phone]
    public required string Telephone { get; set; }
    [StringLength(500)]
    public string? Description { get; set; }

}