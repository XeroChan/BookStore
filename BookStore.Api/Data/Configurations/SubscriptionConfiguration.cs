using BookStore.Api.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BookStore.Api.Data.Configurations;

public class SubscriptionConfiguration : IEntityTypeConfiguration<Subscription>
{
    public void Configure(EntityTypeBuilder<Subscription> builder)
    {
        builder.HasOne(s => s.Author)
            .WithMany()
            .HasForeignKey(s => s.AuthorId)
            .OnDelete(DeleteBehavior.Restrict); // Prevent cascading deletes

        builder.HasOne(s => s.Credential)
            .WithMany()
            .HasForeignKey(s => s.CredentialId)
            .OnDelete(DeleteBehavior.Restrict); // Prevent cascading deletes
    }
}