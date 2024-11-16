using BookStore.Api.Entities;

namespace BookStore.Api.Endpoints;

public static class CommentEndpoints
{
    const string GetCommentEndpointName = "GetComment";
    static List<Comment> comments = new()
    {
        new Comment()
        {
            Id = 1,
            BookId = 1,
            CredentialId = 1,
            CommentString = "Great book!",
            Rating = 4
        },
        new Comment()
        {
            Id = 2,
            BookId = 2,
            CredentialId = 1,
            CommentString = "Great too!",
            Rating = 5
        }
    };
    public static RouteGroupBuilder MapCommentEndpoints(this IEndpointRouteBuilder routes)
    {
        var commentsGroup = routes.MapGroup("/comments").WithParameterValidation();
        commentsGroup.MapGet("/", () => comments);
        commentsGroup.MapGet("/{id}", (int id) =>
        {
            Comment? comment = comments.Find(comment => comment.Id == id);

            if (comment == null)
            {
                return Results.NotFound();
            }
            return Results.Ok(comment);
        })
        .WithName(GetCommentEndpointName);
        commentsGroup.MapPost("/", (Comment comment) =>
        {
            comment.Id = comments.Max(comment => comment.Id) + 1;
            comments.Add(comment);

            return Results.CreatedAtRoute(GetCommentEndpointName, new { id = comment.Id }, comment);
        });
        commentsGroup.MapPut("/{id}", (int id, Comment updatedComment) =>
        {
            Comment? existingComment = comments.Find(comment => comment.Id == id);

            if (existingComment == null)
            {
                return Results.NotFound();
            }
            existingComment.CommentString = updatedComment.CommentString;
            existingComment.Rating = updatedComment.Rating;

            return Results.NoContent();
        });
        commentsGroup.MapDelete("/{id}", (int id) =>
        {
            Comment? comment = comments.Find(comment => comment.Id == id);

            if (comment is not null)
            {
                comments.Remove(comment);
            }

            return Results.NoContent();
        });
        return commentsGroup;
    }
}