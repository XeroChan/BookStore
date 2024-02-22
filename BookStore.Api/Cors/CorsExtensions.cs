namespace BookStore.Api.Cors;

public static class CorsExtensions
{
    private const string allowedOriginSetting = "AllowedOrigin";

    public static IServiceCollection AddBookStoreCors(this IServiceCollection services, IConfiguration configuration)
    {
        return services.AddCors(options =>
        {
            options.AddDefaultPolicy(corsBuilder =>
            {
                var allowedOrigin = "http://localhost:5173"; // configuration.GetSection("AllowedOrigin").Value ?? throw new InvalidOperationException("AllowedOrigin is not set");
                Console.WriteLine($"Allowed Origin: {allowedOrigin}");
                corsBuilder.WithOrigins(allowedOrigin)
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials(); // Add this line
            });
        });
    }
}
