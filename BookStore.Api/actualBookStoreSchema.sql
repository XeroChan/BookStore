CREATE TABLE [Books] (
    [Id] int NOT NULL IDENTITY,
    [Title] nvarchar(100) NOT NULL,
    [author_id] int NOT NULL,
    [Publisher] nvarchar(40) NOT NULL,
    [Genre] nvarchar(50) NOT NULL,
    [Description] nvarchar(800) NOT NULL,
    [ISBN] nvarchar(13) NOT NULL,
    [pages_count] int NOT NULL,
    [Price] decimal(5,2) NOT NULL,
    [release_date] datetime2 NOT NULL,
    [image_uri] nvarchar(250) NOT NULL,
    [date_added] datetime2 NOT NULL,
    CONSTRAINT [PK_Books] PRIMARY KEY ([Id])
);

CREATE TABLE [Clients] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(50) NOT NULL,
    [Surname] nvarchar(50) NOT NULL,
    [Email] nvarchar(100) NOT NULL,
    [Telephone] nvarchar(9) NOT NULL,
    CONSTRAINT [PK_Clients] PRIMARY KEY ([Id])
);

CREATE TABLE [Credentials] (
    [Id] int NOT NULL IDENTITY,
    [client_id] int NOT NULL,
    [Username] nvarchar(20) NOT NULL,
    [Password] nvarchar(20) NOT NULL,
    [is_admin] bit NOT NULL DEFAULT CAST(0 AS bit),
    [is_author] bit NOT NULL,
    CONSTRAINT [PK_Credentials] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Credentials_Clients_client_id] FOREIGN KEY ([client_id]) REFERENCES [Clients] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [Rentals] (
    [Id] int NOT NULL IDENTITY,
    [client_id] int NOT NULL,
    [book_id] int NOT NULL,
    [rental_date] datetime2 NOT NULL,
    [due_date] datetime2 NOT NULL,
    CONSTRAINT [PK_Rentals] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Rentals_Books_book_id] FOREIGN KEY ([book_id]) REFERENCES [Books] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_Rentals_Clients_client_id] FOREIGN KEY ([client_id]) REFERENCES [Clients] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [Authors] (
    [Id] int NOT NULL IDENTITY,
    [CredentialId] int NOT NULL,
    [AuthorName] nvarchar(60) NOT NULL,
    [AuthorSurname] nvarchar(60) NOT NULL,
    CONSTRAINT [PK_Authors] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Authors_Credentials_CredentialId] FOREIGN KEY ([CredentialId]) REFERENCES [Credentials] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [Comments] (
    [Id] int NOT NULL IDENTITY,
    [BookId] int NOT NULL,
    [CredentialId] int NOT NULL,
    [CommentString] nvarchar(250) NOT NULL,
    [Rating] int NOT NULL,
    CONSTRAINT [PK_Comments] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Comments_Books_BookId] FOREIGN KEY ([BookId]) REFERENCES [Books] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_Comments_Credentials_CredentialId] FOREIGN KEY ([CredentialId]) REFERENCES [Credentials] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [Subscriptions] (
    [Id] int NOT NULL IDENTITY,
    [AuthorId] int NOT NULL,
    [CredentialId] int NOT NULL,
    CONSTRAINT [PK_Subscriptions] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Subscriptions_Authors_AuthorId] FOREIGN KEY ([AuthorId]) REFERENCES [Authors] ([Id]) ON DELETE NO ACTION,
    CONSTRAINT [FK_Subscriptions_Credentials_CredentialId] FOREIGN KEY ([CredentialId]) REFERENCES [Credentials] ([Id]) ON DELETE NO ACTION
);

CREATE INDEX [IX_Authors_CredentialId] ON [Authors] ([CredentialId]);

CREATE INDEX [IX_Comments_BookId] ON [Comments] ([BookId]);

CREATE INDEX [IX_Comments_CredentialId] ON [Comments] ([CredentialId]);

CREATE INDEX [IX_Credentials_client_id] ON [Credentials] ([client_id]);

CREATE INDEX [IX_Rentals_book_id] ON [Rentals] ([book_id]);

CREATE INDEX [IX_Rentals_client_id] ON [Rentals] ([client_id]);

CREATE INDEX [IX_Subscriptions_AuthorId] ON [Subscriptions] ([AuthorId]);

CREATE INDEX [IX_Subscriptions_CredentialId] ON [Subscriptions] ([CredentialId]);
