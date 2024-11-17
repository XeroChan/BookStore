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
        commentsGroup.MapGet("/", (ICommentRepository commentRepository) => commentRepository.GetAll().Select(comment => comment.AsDto()));
        commentsGroup.MapGet("/{id}", (ICommentRepository commentRepository, int id) =>
        {
            Comment? comment = commentRepository.Get(id);
            return comment is not null ? Results.Ok(comment.AsDto()) : Results.NotFound();
        })
        .WithName(GetCommentEndpointName);
        commentsGroup.MapPost("/", (ICommentRepository commentRepository, CommentDto commentDto) =>
        {
            Comment comment = new()
            {
                CommentString = commentDto.CommentString,
                Rating = commentDto.Rating
            };
            commentRepository.Create(comment);

            return Results.CreatedAtRoute(GetCommentEndpointName, new { id = comment.Id }, comment);
        });
        commentsGroup.MapPut("/{id}", (ICommentRepository commentRepository, int id, CommentDto updatedCommentDto) =>
        {
            Comment? existingComment = commentRepository.Get(id);

            if (existingComment == null)
            {
                return Results.NotFound();
            }
            existingComment.CommentString = updatedCommentDto.CommentString;
            existingComment.Rating = updatedCommentDto.Rating;

            commentRepository.Update(existingComment);
            return Results.NoContent();
        });
        commentsGroup.MapDelete("/{id}", (ICommentRepository commentRepository, int id) =>
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