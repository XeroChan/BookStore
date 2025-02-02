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
        subscriptionsGroup.MapGet("/user/{userId}", async (ISubscriptionRepository subscriptionRepository, int userId) =>
        {
            var subscriptions = await subscriptionRepository.GetByUserIdAsync(userId);
            return Results.Ok(subscriptions);
        });

        subscriptionsGroup.MapGet("/credential/{credentialId}/newPublications", async (ISubscriptionRepository subscriptionRepository, int credentialId) =>
        {
            var publications = await subscriptionRepository.GetNewPublicationsForCredentialAsync(credentialId);
            return Results.Ok(publications);
        });
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
        subscriptionsGroup.MapGet("/credential/{credentialId}", async (ISubscriptionRepository subscriptionRepository, int credentialId) =>
        {
            var subscriptions = await subscriptionRepository.GetByUserIdAsync(credentialId);
            return Results.Ok(subscriptions);
        });
        return subscriptionsGroup;
    }
}