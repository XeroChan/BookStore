using BookStore.Api.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BookStore.Api.Data.Configurations;

public class CredentialConfiguration : IEntityTypeConfiguration<Credential>
{
    public void Configure(EntityTypeBuilder<Credential> builder)
    {
        builder.Property(credential => credential.IsAdmin)
                .HasDefaultValue(false);
        builder.Property(credential => credential.Password)
            .HasMaxLength(20);
    }
}