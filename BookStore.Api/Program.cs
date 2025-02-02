using System.Security.Cryptography;
using System.Text;
using BookStore.Api.Authorization;
using BookStore.Api.Cors;
using BookStore.Api.Data;
using BookStore.Api.Endpoints;
using BookStore.Api.ErrorHandling;
using BookStore.Api.Middleware;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args); // register/define services for app
builder.Services.AddRepositories(builder.Configuration);

var secretKey = GenerateRandomSecretKey();
var skey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}
).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = skey,
        ValidateIssuer = true,
        ValidIssuer = "dotnet-user-jwts", // Match the issuer in appsettings.json
        ValidateAudience = true,
        ValidAudiences = new[]
        {
            "http://localhost:65098",
            "https://localhost:44382",
            "http://localhost:5088",
            "https://localhost:7066",
            "https://localhost:5173"
        }
    };
});
builder.Services.AddBookStoreAuthorization();
builder.Services.AddApiVersioning(options =>
{
    options.DefaultApiVersion = new(1.0);
    options.AssumeDefaultVersionWhenUnspecified = true; // default api version
});

builder.Services.AddBookStoreCors(builder.Configuration);

var app = builder.Build(); // define app pipeline - endpoints


app.UseCors();
app.UseExceptionHandler(exceptionHandler => exceptionHandler.ConfigureExceptionHandler());
app.UseMiddleware<RequestTimingMiddleware>();

await app.Services.InitializeDbAsync();

app.UseHttpLogging();

app.MapAuthorEndpoints();
app.MapBooksEndpoints();
app.MapClientsEndpoints();
app.MapCommentEndpoints();
app.MapCredentialsEndpoints();
app.MapRentalsEndpoints();
app.MapSubscriptionEndpoints();
app.MapAuthEndpoints(skey);

app.Run(); // run the app

string GenerateRandomSecretKey()
{
    var key = new byte[32];
    using (var rng = RandomNumberGenerator.Create())
    {
        rng.GetBytes(key);
    }

    return Convert.ToBase64String(key);
}