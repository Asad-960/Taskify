using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class DatabaseUpdate3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "CategoryId",
                table: "TaskItems",
                type: "TEXT",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_TaskItems_CategoryId",
                table: "TaskItems",
                column: "CategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_TaskItems_Categories_CategoryId",
                table: "TaskItems",
                column: "CategoryId",
                principalTable: "Categories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TaskItems_Categories_CategoryId",
                table: "TaskItems");

            migrationBuilder.DropIndex(
                name: "IX_TaskItems_CategoryId",
                table: "TaskItems");

            migrationBuilder.DropColumn(
                name: "CategoryId",
                table: "TaskItems");
        }
    }
}
