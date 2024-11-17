using BookStore.Api.Entities;
using BookStore.Api.Repositories;

namespace BookStore.Api.Endpoints;

public static class SubscriptionEndpoints
{
    const string GetSubscriptionEndpointName = "GetSubscription";

    public static RouteGroupBuilder MapSubscriptionEndpoints(this IEndpointRouteBuilder routes)
    {
        var subscriptionsGroup = routes.MapGroup("/subscriptions").WithParameterValidation();
        subscriptionsGroup.MapGet("/", (ISubscriptionRepository subscriptionRepository) => subscriptionRepository.GetAllAsync());
        subscriptionsGroup.MapGet("/{id}", (ISubscriptionRepository subscriptionRepository, int id) =>
        {
            Subscription? subscription = subscriptionRepository.GetAsync(id);
            return subscription is not null ? Results.Ok(subscription) : Results.NotFound();
        })
        .WithName(GetSubscriptionEndpointName);
        subscriptionsGroup.MapPost("", (ISubscriptionRepository subscriptionRepository, Subscription subscription) =>
        {
            subscriptionRepository.CreateAsync(subscription);

            return Results.CreatedAtRoute(GetSubscriptionEndpointName, new { id = subscription.Id }, subscription);
        });
        subscriptionsGroup.MapDelete("/{id}", (ISubscriptionRepository subscriptionRepository, int id) =>
        {
            Subscription? subscription = subscriptionRepository.GetAsync(id);

            if (subscription is not null)
            {
                subscriptionRepository.DeleteAsync(id);
            }

            return Results.NoContent();
        });
        return subscriptionsGroup;
    }
}