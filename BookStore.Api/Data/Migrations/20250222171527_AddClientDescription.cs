﻿using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BookStore.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddClientDescription : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Clients",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Description",
                table: "Clients");
        }
    }
}
