using System.IdentityModel.Tokens.Jwt;  // sezon 1 odc 8 net course
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using BookStore.Api.Authorization;
using BookStore.Api.Cors;
using BookStore.Api.Data;
using BookStore.Api.Endpoints;
using BookStore.Api.Entities;
using BookStore.Api.ErrorHandling;
using BookStore.Api.Middleware;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
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

app.MapClientsEndpoints();
app.MapCredentialsEndpoints();
app.MapRentalsEndpoints();
app.MapBooksEndpoints();
app.MapPost("/login", async (Credential credential, BookStoreContext db) =>
{
    Console.WriteLine($"Attempting login for username: {credential.Username}");

    var u = await db.Credentials
        .Where(u => u.Username == credential.Username && u.Password == credential.Password)
        .FirstOrDefaultAsync();

    if (u == null)
    {
        Console.WriteLine("Login failed. No matching user found.");
        return Results.Unauthorized();
    }
    else
    {
        Console.WriteLine($"Login successful for user: {u.Username}");
        // Generate token
        var token = CreateAccessToken(u, skey);
        Console.WriteLine($"Generated token: {token}");
        return Results.Ok(token);
    }
});






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

string CreateAccessToken(Credential u, SymmetricSecurityKey skey)
{

    string assignedRole = "";
    string assignedScope = "";

    if (u.IsAdmin)
    {
        assignedRole = "Admin";
        assignedScope = "store:write";
    }
    else
    {
        assignedRole = "Client";
        assignedScope = "store:write";

    }

    // SigningCredentials with HmacSha256
    var signingCredentials = new SigningCredentials(skey, SecurityAlgorithms.HmacSha256Signature);

    // Add user claims, including roles
    var userClaims = new List<Claim>
    {
        new Claim(JwtRegisteredClaimNames.Sub, u.Username),
        // Add role claims
        new Claim(ClaimTypes.Role, assignedRole), // Add the "Admin" role
        // Add client ID as a claim
        new Claim("clientId", u.ClientId.ToString()), // Assuming u.ClientId is the client ID
        // Add more claims as needed
    };

    // Add user scopes
    var userScopes = new List<string>
    {
        assignedScope
        // Add more scopes as needed
    };

    // Set expiration time for the token
    var expires = DateTime.UtcNow.AddDays(1);

    // Generate a unique JTI (JWT ID)
    var jti = Guid.NewGuid().ToString();

    var audiences = new List<string>
    {
        "http://localhost:65098",
        "https://localhost:44382",
        "http://localhost:5088",
        "https://localhost:7066",
        "http://localhost:5173"
    };

    // Create the token descriptor
    var tokenDescriptor = new SecurityTokenDescriptor
    {
        Subject = new ClaimsIdentity(userClaims),
        Expires = expires,
        Issuer = "dotnet-user-jwts",
        SigningCredentials = signingCredentials,
        // Add user scopes as claims
        Claims = new Dictionary<string, object>
        {
            { "scope", string.Join(" ", userScopes) },
            { JwtRegisteredClaimNames.Jti, jti }, // Add JTI claim
            { JwtRegisteredClaimNames.Aud, audiences } // Add audiences claim
        }
    };

    // Initiate the token handler
    var tokenHandler = new JwtSecurityTokenHandler();

    // Create the JWT token
    var tokenJwt = tokenHandler.CreateToken(tokenDescriptor);

    // Write and return the token
    var token = tokenHandler.WriteToken(tokenJwt);
    return token;
}
