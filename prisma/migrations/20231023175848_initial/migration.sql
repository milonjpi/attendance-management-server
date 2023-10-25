BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[users] (
    [id] INT NOT NULL IDENTITY(1,1),
    [fullName] NVARCHAR(1000) NOT NULL,
    [userName] NVARCHAR(1000) NOT NULL,
    [password] NVARCHAR(1000) NOT NULL,
    [role] NVARCHAR(1000) NOT NULL CONSTRAINT [users_role_df] DEFAULT 'user',
    [profileImg] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [users_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [users_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [users_userName_key] UNIQUE NONCLUSTERED ([userName])
);

-- CreateTable
CREATE TABLE [dbo].[menuPermissions] (
    [id] INT NOT NULL IDENTITY(1,1),
    [userId] INT NOT NULL,
    [label] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [menuPermissions_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[subMenuPermissions] (
    [id] INT NOT NULL IDENTITY(1,1),
    [userId] INT NOT NULL,
    [label] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [subMenuPermissions_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[sectionPermissions] (
    [id] INT NOT NULL IDENTITY(1,1),
    [userId] INT NOT NULL,
    [label] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [sectionPermissions_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[designations] (
    [id] INT NOT NULL IDENTITY(1,1),
    [label] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [designations_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [designations_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [designations_label_key] UNIQUE NONCLUSTERED ([label])
);

-- CreateTable
CREATE TABLE [dbo].[departments] (
    [id] INT NOT NULL IDENTITY(1,1),
    [label] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [departments_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [departments_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [departments_label_key] UNIQUE NONCLUSTERED ([label])
);

-- CreateTable
CREATE TABLE [dbo].[locations] (
    [id] INT NOT NULL IDENTITY(1,1),
    [label] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [locations_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [locations_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [locations_label_key] UNIQUE NONCLUSTERED ([label])
);

-- CreateTable
CREATE TABLE [dbo].[employees] (
    [employeeId] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [designationId] INT NOT NULL,
    [departmentId] INT NOT NULL,
    [locationId] INT NOT NULL,
    [photo] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [employees_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [employees_pkey] PRIMARY KEY CLUSTERED ([employeeId])
);

-- CreateTable
CREATE TABLE [dbo].[authLogs] (
    [id] INT NOT NULL IDENTITY(1,1),
    [employeeId] NVARCHAR(1000) NOT NULL,
    [punchTime] DATETIME2 NOT NULL,
    CONSTRAINT [authLogs_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[attendances] (
    [id] INT NOT NULL IDENTITY(1,1),
    [employeeId] NVARCHAR(1000) NOT NULL,
    [inTime] DATETIME2 NOT NULL,
    [outTime] DATETIME2,
    CONSTRAINT [attendances_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[menuPermissions] ADD CONSTRAINT [menuPermissions_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[subMenuPermissions] ADD CONSTRAINT [subMenuPermissions_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[sectionPermissions] ADD CONSTRAINT [sectionPermissions_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[employees] ADD CONSTRAINT [employees_designationId_fkey] FOREIGN KEY ([designationId]) REFERENCES [dbo].[designations]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[employees] ADD CONSTRAINT [employees_departmentId_fkey] FOREIGN KEY ([departmentId]) REFERENCES [dbo].[departments]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[employees] ADD CONSTRAINT [employees_locationId_fkey] FOREIGN KEY ([locationId]) REFERENCES [dbo].[locations]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[authLogs] ADD CONSTRAINT [authLogs_employeeId_fkey] FOREIGN KEY ([employeeId]) REFERENCES [dbo].[employees]([employeeId]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[attendances] ADD CONSTRAINT [attendances_employeeId_fkey] FOREIGN KEY ([employeeId]) REFERENCES [dbo].[employees]([employeeId]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
