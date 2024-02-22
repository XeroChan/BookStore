namespace BookStore.Api.Authorization;

public static class AuthorizationExtensions
{
    public static IServiceCollection AddBookStoreAuthorization(this IServiceCollection services)
    {
        services.AddAuthorization(options =>
        {
            // Policy for clients to post to clients and rentals
            options.AddPolicy(Policies.ClientWriteAccess, builder =>
                builder.RequireClaim("scope", "store:write")
                    .RequireRole("Client"));

            // Policy for admins to have full access
            options.AddPolicy(Policies.AdminAccess, builder =>
                builder.RequireClaim("scope", "store:write")
                    .RequireRole("Admin"));

        });

        return services;
    }
}