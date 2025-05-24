BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[locations] ADD [areaId] INT;

-- CreateTable
CREATE TABLE [dbo].[areas] (
    [id] INT NOT NULL IDENTITY(1,1),
    [label] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [areas_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [areas_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [areas_label_key] UNIQUE NONCLUSTERED ([label])
);

-- CreateTable
CREATE TABLE [dbo].[salaries] (
    [id] INT NOT NULL IDENTITY(1,1),
    [officeId] NVARCHAR(1000) NOT NULL,
    [fromDate] DATETIME2 NOT NULL,
    [toDate] DATETIME2,
    [salary] INT NOT NULL CONSTRAINT [salaries_salary_df] DEFAULT 0,
    [remarks] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [salaries_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [salaries_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[transfers] (
    [id] INT NOT NULL IDENTITY(1,1),
    [officeId] NVARCHAR(1000) NOT NULL,
    [date] DATETIME2 NOT NULL,
    [fromLocationId] INT NOT NULL,
    [toLocationId] INT NOT NULL,
    [remarks] NVARCHAR(1000),
    [isApproved] BIT NOT NULL CONSTRAINT [transfers_isApproved_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [transfers_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [transfers_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[locations] ADD CONSTRAINT [locations_areaId_fkey] FOREIGN KEY ([areaId]) REFERENCES [dbo].[areas]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[salaries] ADD CONSTRAINT [salaries_officeId_fkey] FOREIGN KEY ([officeId]) REFERENCES [dbo].[employees]([officeId]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[transfers] ADD CONSTRAINT [transfers_officeId_fkey] FOREIGN KEY ([officeId]) REFERENCES [dbo].[employees]([officeId]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[transfers] ADD CONSTRAINT [transfers_fromLocationId_fkey] FOREIGN KEY ([fromLocationId]) REFERENCES [dbo].[locations]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[transfers] ADD CONSTRAINT [transfers_toLocationId_fkey] FOREIGN KEY ([toLocationId]) REFERENCES [dbo].[locations]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
