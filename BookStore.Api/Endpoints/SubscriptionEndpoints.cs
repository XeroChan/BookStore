using BookStore.Api.Entities;
using BookStore.Api.Repositories;

namespace BookStore.Api.Endpoints;

public static class SubscriptionEndpoints
{
    const string GetSubscriptionEndpointName = "GetSubscription";

    public static RouteGroupBuilder MapSubscriptionEndpoints(this IEndpointRouteBuilder routes)
    {
        var subscriptionsGroup = routes.MapGroup("/subscriptions").WithParameterValidation();
        subscriptionsGroup.MapGet("/", async (ISubscriptionRepository subscriptionRepository) => await subscriptionRepository.GetAllAsync());
        subscriptionsGroup.MapGet("/{id}", async (ISubscriptionRepository subscriptionRepository, int id) =>
        {
            Subscription? subscription = await subscriptionRepository.GetAsync(id);
            return subscription is not null ? Results.Ok(subscription) : Results.NotFound();
        })
        .WithName(GetSubscriptionEndpointName);
        subscriptionsGroup.MapPost("", async (ISubscriptionRepository subscriptionRepository, Subscription subscription) =>
        {
            await subscriptionRepository.CreateAsync(subscription);

            return Results.CreatedAtRoute(GetSubscriptionEndpointName, new { id = subscription.Id }, subscription);
        });
        subscriptionsGroup.MapDelete("/{id}", async (ISubscriptionRepository subscriptionRepository, int id) =>
        {
            Subscription? subscription = await subscriptionRepository.GetAsync(id);

            if (subscription is not null)
            {
                await subscriptionRepository.DeleteAsync(id);
            }

            return Results.NoContent();
        });
        return subscriptionsGroup;
    }
}