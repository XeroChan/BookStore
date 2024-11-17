using BookStore.Api.Repositories;
using Microsoft.EntityFrameworkCore;

namespace BookStore.Api.Data;

public static class DataExtensions
{
    public static async Task InitializeDbAsync(this IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<BookStoreContext>();
        await dbContext.Database.MigrateAsync(); // apply migrations on app start

        var logger = serviceProvider.GetRequiredService<ILoggerFactory>()
            .CreateLogger("DB Initializer");
        logger.LogInformation(420, "The database is ready"); //logger
    }
    public static IServiceCollection AddRepositories(this IServiceCollection services, IConfiguration configuration)
    {
        var connString = configuration.GetConnectionString("BookStoreContext");// reads config by appsettings.json or from secret manager as of now
        services.AddSqlServer<BookStoreContext>(connString) // configure the sql server with conn string 
            .AddScoped<IAuthorRepository, EntityFrameworkAuthorsRepository>()
            .AddScoped<IBooksRepository, EntityFrameworkBooksRepository>()
            .AddScoped<IClientRepository, EntityFrameworkClientsRepository>()
            .AddScoped<ICommentRepository, EntityFrameworkCommentsRepository>()
            .AddScoped<ICredentialRepository, EntityFrameworkCredentialsRepository>()
            .AddScoped<IRentalRepository, EntityFrameworkRentalsRepository>()
            .AddScoped<ISubscriptionRepository, EntityFrameworkSubscriptionRepository>();

        // add the interface that connects to repo as 1st arg, 2nd param is what type to activate when someone requests
        // the interface
        //registration of interface and repo
        //singleton - reuse the repo across the service lifetime
        return services;
    }
}