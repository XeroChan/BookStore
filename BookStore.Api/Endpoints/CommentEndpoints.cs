using BookStore.Api.Entities;
using BookStore.Api.Repositories;

namespace BookStore.Api.Endpoints;

public static class CommentEndpoints
{
    const string GetCommentEndpointName = "GetComment";
    
    public static RouteGroupBuilder MapCommentEndpoints(this IEndpointRouteBuilder routes)
    {
        InMemCommentRepository commentRepository = new();
        var commentsGroup = routes.MapGroup("/comments").WithParameterValidation();
        commentsGroup.MapGet("/", () => commentRepository.GetAll());
        commentsGroup.MapGet("/{id}", (int id) =>
        {
            Comment? comment = commentRepository.Get(id);
            return comment is not null ? Results.Ok(comment) : Results.NotFound();
        })
        .WithName(GetCommentEndpointName);
        commentsGroup.MapPost("/", (Comment comment) =>
        {
            commentRepository.Create(comment);

            return Results.CreatedAtRoute(GetCommentEndpointName, new { id = comment.Id }, comment);
        });
        commentsGroup.MapPut("/{id}", (int id, Comment updatedComment) =>
        {
            Comment? existingComment = commentRepository.Get(id);

            if (existingComment == null)
            {
                return Results.NotFound();
            }
            existingComment.CommentString = updatedComment.CommentString;
            existingComment.Rating = updatedComment.Rating;

            commentRepository.Update(existingComment);
            return Results.NoContent();
        });
        commentsGroup.MapDelete("/{id}", (int id) =>
        {
            Comment? comment = commentRepository.Get(id);

            if (comment is not null)
            {
                commentRepository.Delete(id);
            }

            return Results.NoContent();
        });
        return commentsGroup;
    }
}