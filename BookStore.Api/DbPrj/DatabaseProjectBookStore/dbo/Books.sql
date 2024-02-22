CREATE TABLE [dbo].[Books] (
    [Id]          INT            IDENTITY (1, 1) NOT NULL,
    [Title]       NVARCHAR (100) NOT NULL,
    [Author]      NVARCHAR (30)  NOT NULL,
    [Publisher]   NVARCHAR (40)  NOT NULL,
    [Genre]       NVARCHAR (20)  NOT NULL,
    [Description] NVARCHAR (800) NOT NULL,
    [ISBN]        NVARCHAR (13)  NOT NULL,
    [PagesCount]  INT            NOT NULL,
    [Price]       DECIMAL (5, 2) NOT NULL,
    [ReleaseDate] DATETIME2 (7)  NOT NULL,
    [ImageUri]    NVARCHAR (100) NOT NULL,
    CONSTRAINT [PK_Books] PRIMARY KEY CLUSTERED ([Id] ASC)
);


GO

