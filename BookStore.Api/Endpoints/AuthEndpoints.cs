using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using BookStore.Api.Data;
using BookStore.Api.Dtos;
using BookStore.Api.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace BookStore.Api.Endpoints;

public static class AuthEndpoints
{
    public static void MapAuthEndpoints(this IEndpointRouteBuilder routes, SymmetricSecurityKey skey)
    {
        routes.MapPost("/login", async (LoginDto loginDto, BookStoreContext db) =>
        {
            Console.WriteLine($"Attempting login for username: {loginDto.Username}");

            var credential = await db.Credentials
                .Where(u => u.Username == loginDto.Username)
                .FirstOrDefaultAsync();

            if (credential == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, credential.Password))
            {
                return Results.BadRequest(new { Message = "Invalid username or password." });
            }
            else
            {
                Console.WriteLine($"Login successful for user: {credential.Username}");
                // Generate token
                var token = CreateAccessToken(credential, skey);
                Console.WriteLine($"Generated token: {token}");
                return Results.Ok(token);
            }
        });
    }

    private static string CreateAccessToken(Credential u, SymmetricSecurityKey skey)
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
            new Claim("clientId", u.ClientId.ToString()),
        };

        // Add user scopes
        var userScopes = new List<string>
        {
            assignedScope
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
}