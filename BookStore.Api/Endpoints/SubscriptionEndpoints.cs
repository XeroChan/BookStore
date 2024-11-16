using BookStore.Api.Entities;
using BookStore.Api.Repositories;

namespace BookStore.Api.Endpoints;

public static class SubscriptionEndpoints
{
    const string GetSubscriptionEndpointName = "GetSubscription";

    public static RouteGroupBuilder MapSubscriptionEndpoints(this IEndpointRouteBuilder routes)
    {
        InMemSubscriptionRepository subscriptionRepository = new();
        var subscriptionsGroup = routes.MapGroup("/subscriptions").WithParameterValidation();
        subscriptionsGroup.MapGet("/", () => subscriptionRepository.GetAll());
        subscriptionsGroup.MapGet("/{id}", (int id) =>
        {
            Subscription? subscription = subscriptionRepository.Get(id);
            return subscription is not null ? Results.Ok(subscription) : Results.NotFound();
        })
        .WithName(GetSubscriptionEndpointName);
        subscriptionsGroup.MapPost("", (Subscription subscription) =>
        {
            subscriptionRepository.Create(subscription);

            return Results.CreatedAtRoute(GetSubscriptionEndpointName, new { id = subscription.Id }, subscription);
        });
        subscriptionsGroup.MapDelete("/{id}", (int id) =>
        {
            Subscription? subscription = subscriptionRepository.Get(id);

            if (subscription is not null)
            {
                subscriptionRepository.Delete(id);
            }

            return Results.NoContent();
        });
        return subscriptionsGroup;
    }
}