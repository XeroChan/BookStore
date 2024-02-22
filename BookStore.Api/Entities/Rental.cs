using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookStore.Api.Entities;

public class Rental
{
    public int Id { get; set; }
    [Required]
    [Column("client_id")]
    public int ClientId { get; set; }
    [Required]
    [Column("book_id")]
    public int BookId { get; set; }
    [Column("rental_date")]
    public DateTime RentalDate { get; set; }
    [Column("due_date")]
    public DateTime DueDate { get; set; }
    // Navigation properties
    public Client? Client { get; set; }
    public Book? Book { get; set; }
}