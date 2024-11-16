using BookStore.Api.Entities;

namespace BookStore.Api.Endpoints;

public static class SubscriptionEndpoints
{
    const string GetSubscriptionEndpointName = "GetSubscription";

    static List<Subscription> subscriptions = new()
    {
        new Subscription()
        {
            Id = 1,
            AuthorId = 1,
            CredentialId = 2

        },
        new Subscription()
        {
            Id = 2,
            AuthorId = 2,
            CredentialId = 1
        }
    };
    public static RouteGroupBuilder MapSubscriptionEndpoints(this IEndpointRouteBuilder routes)
    {
        var subscriptionsGroup = routes.MapGroup("/subscriptions").WithParameterValidation();

        subscriptionsGroup.MapGet("/", () => subscriptions);
        subscriptionsGroup.MapGet("/{id}", (int id) =>
        {
            Subscription? subscription = subscriptions.Find(subscription => subscription.Id == id);

            if (subscription == null)
            {
                return Results.NotFound();
            }
            return Results.Ok(subscription);
        })
        .WithName(GetSubscriptionEndpointName);
        subscriptionsGroup.MapPost("", (Subscription subscription) =>
        {
            subscription.Id = subscriptions.Max(subscription => subscription.Id) + 1;
            subscriptions.Add(subscription);

            return Results.CreatedAtRoute(GetSubscriptionEndpointName, new { id = subscription.Id }, subscription);
        });
        subscriptionsGroup.MapDelete("/{id}", (int id) =>
        {
            Subscription? subscription = subscriptions.Find(subscription => subscription.Id == id);

            if (subscription is not null)
            {
                subscriptions.Remove(subscription);
            }

            return Results.NoContent();
        });
        return subscriptionsGroup;
    }
}