CREATE TABLE [dbo].[Credentials] (
    [Id]       INT           IDENTITY (1, 1) NOT NULL,
    [ClientId] INT           NOT NULL,
    [Username] NVARCHAR (20) NOT NULL,
    [Password] NVARCHAR (20) NOT NULL,
    CONSTRAINT [PK_Credentials] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Credentials_Clients_ClientId] FOREIGN KEY ([ClientId]) REFERENCES [dbo].[Clients] ([Id]) ON DELETE CASCADE
);


GO

CREATE NONCLUSTERED INDEX [IX_Credentials_ClientId]
    ON [dbo].[Credentials]([ClientId] ASC);


GO

