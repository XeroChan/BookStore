using System.Reflection;
using BookStore.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace BookStore.Api.Data;

public class BookStoreContext : DbContext // session with database, used to query data
{
    public BookStoreContext(DbContextOptions<BookStoreContext> options)
        : base(options) // allows BookStoreContext class to grab the details to connect to database
    {
    }

    public DbSet<Author> Authors => Set<Author>();
    public DbSet<Book> Books => Set<Book>();
    public DbSet<Client> Clients => Set<Client>();
    public DbSet<Comment> Comments => Set<Comment>();
    public DbSet<Credential> Credentials => Set<Credential>();
    public DbSet<Rental> Rentals => Set<Rental>();
    public DbSet<Subscription> Subscriptions => Set<Subscription>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly()); // when model gets created as part of migration, context is going to tell the migration to apply defined configuration
    }
}