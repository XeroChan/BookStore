using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookStore.Api.Entities;

public class Book
{
    public int Id { get; set; }
    [Required] // server side validation, need a NuGet validator as well/ endpoint filter
    [StringLength(100)]
    public required string Title { get; set; } // tell compiler that it can be declared in declaration or definition
    [Required]
    [Column("author_id")]
    public required int AuthorId { get; set; }
    [Required]
    [StringLength(40)]
    public required string Publisher { get; set; }
    [Required]
    [StringLength(50)]
    public required string Genre { get; set; }
    [Required]
    [StringLength(800)]
    public required string Description { get; set; }
    [Required]
    [StringLength(13)]
    public required string ISBN { get; set; }
    [Required]
    [Range(1, 2000)]
    [Column("pages_count")]
    public required int PagesCount { get; set; }
    [Required]
    [Range(1, 200)]
    public decimal Price { get; set; }
    [Column("release_date")]
    public DateTime ReleaseDate { get; set; }
    [Url]
    [StringLength(250)]
    [Column("image_uri")]
    public required string ImageUri { get; set; }
}