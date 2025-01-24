using BookStore.Api.Dtos;
using BookStore.Api.Entities;
using BookStore.Api.Repositories;

namespace BookStore.Api.Endpoints;

public static class CommentEndpoints
{
    const string GetCommentEndpointName = "GetComment";

    public static RouteGroupBuilder MapCommentEndpoints(this IEndpointRouteBuilder routes)
    {
        var commentsGroup = routes.MapGroup("/comments").WithParameterValidation();
        commentsGroup.MapGet("/", async (ICommentRepository commentRepository) => (await commentRepository.GetAllAsync()).Select(comment => comment.AsDto()));
        commentsGroup.MapGet("/{id}", async (ICommentRepository commentRepository, int id) =>
        {
            Comment? comment = await commentRepository.GetAsync(id);
            return comment is not null ? Results.Ok(comment.AsDto()) : Results.NotFound();
        })
        .WithName(GetCommentEndpointName);
        commentsGroup.MapGet("/user/{userId}", async (ICommentRepository commentRepository, int userId) =>
        {
            var comments = await commentRepository.GetByUserIdAsync(userId);
            if (!comments.Any())
            {
                return Results.NotFound("No comments found for this user.");
            }

            return Results.Ok(comments.Select(comment => comment.AsDto()));
        });
        commentsGroup.MapGet("/book/{bookId}", async (ICommentRepository commentRepository, int bookId) =>
        {
            var comments = await commentRepository.GetByBookIdAsync(bookId);
            if (!comments.Any())
            {
                return Results.NotFound("No comments found for this book.");
            }

            return Results.Ok(comments.Select(comment => comment.AsDto()));
        });
        commentsGroup.MapPost("/", async (ICommentRepository commentRepository, CommentDto commentDto) =>
        {
            Comment comment = new()
            {
                CommentString = commentDto.CommentString,
                Rating = commentDto.Rating,
                BookId = commentDto.BookId,
                CredentialId = commentDto.CredentialId
            };
            await commentRepository.CreateAsync(comment);

            return Results.CreatedAtRoute(GetCommentEndpointName, new { id = comment.Id }, comment);
        });
        commentsGroup.MapPut("/{id}", async (ICommentRepository commentRepository, int id, CommentDto updatedCommentDto) =>
        {
            Comment? existingComment = await commentRepository.GetAsync(id);

            if (existingComment == null)
            {
                return Results.NotFound();
            }
            existingComment.CommentString = updatedCommentDto.CommentString;
            existingComment.Rating = updatedCommentDto.Rating;

            await commentRepository.UpdateAsync(existingComment);
            return Results.NoContent();
        });
        commentsGroup.MapDelete("/{id}", async (ICommentRepository commentRepository, int id) =>
        {
            Comment? comment = await commentRepository.GetAsync(id);

            if (comment is not null)
            {
                await commentRepository.DeleteAsync(id);
            }

            return Results.NoContent();
        });
        return commentsGroup;
    }
}