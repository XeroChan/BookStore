CREATE TABLE [dbo].[Rentals] (
    [Id]         INT           IDENTITY (1, 1) NOT NULL,
    [ClientId]   INT           NOT NULL,
    [BookId]     INT           NOT NULL,
    [RentalDate] DATETIME2 (7) NOT NULL,
    [DueDate]    DATETIME2 (7) NOT NULL,
    CONSTRAINT [PK_Rentals] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Rentals_Books_BookId] FOREIGN KEY ([BookId]) REFERENCES [dbo].[Books] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_Rentals_Clients_ClientId] FOREIGN KEY ([ClientId]) REFERENCES [dbo].[Clients] ([Id]) ON DELETE CASCADE
);


GO

CREATE NONCLUSTERED INDEX [IX_Rentals_BookId]
    ON [dbo].[Rentals]([BookId] ASC);


GO

CREATE NONCLUSTERED INDEX [IX_Rentals_ClientId]
    ON [dbo].[Rentals]([ClientId] ASC);


GO

