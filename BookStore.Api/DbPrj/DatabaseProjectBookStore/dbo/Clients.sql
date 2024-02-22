CREATE TABLE [dbo].[Clients] (
    [Id]        INT            IDENTITY (1, 1) NOT NULL,
    [Name]      NVARCHAR (50)  NOT NULL,
    [Surname]   NVARCHAR (50)  NOT NULL,
    [Email]     NVARCHAR (100) NOT NULL,
    [Telephone] NVARCHAR (9)   NOT NULL,
    CONSTRAINT [PK_Clients] PRIMARY KEY CLUSTERED ([Id] ASC)
);


GO

