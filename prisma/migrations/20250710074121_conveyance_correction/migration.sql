BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[conveyances] (
    [id] INT NOT NULL IDENTITY(1,1),
    [officeId] NVARCHAR(1000) NOT NULL,
    [date] DATETIME2 NOT NULL,
    [amount] INT NOT NULL,
    [remarks] NVARCHAR(1000),
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [conveyances_status_df] DEFAULT 'Pending',
    [userId] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [conveyances_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [conveyances_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[conveyanceDetails] (
    [id] INT NOT NULL IDENTITY(1,1),
    [conveyanceId] INT NOT NULL,
    [itemTypeId] INT NOT NULL,
    [from] NVARCHAR(1000),
    [to] NVARCHAR(1000),
    [distance] INT NOT NULL CONSTRAINT [conveyanceDetails_distance_df] DEFAULT 0,
    [vehicleTypeId] INT,
    [details] NVARCHAR(1000),
    [amount] INT NOT NULL,
    [remarks] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [conveyanceDetails_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [conveyanceDetails_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[conveyances] ADD CONSTRAINT [conveyances_officeId_fkey] FOREIGN KEY ([officeId]) REFERENCES [dbo].[employees]([officeId]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[conveyances] ADD CONSTRAINT [conveyances_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[conveyanceDetails] ADD CONSTRAINT [conveyanceDetails_conveyanceId_fkey] FOREIGN KEY ([conveyanceId]) REFERENCES [dbo].[conveyances]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[conveyanceDetails] ADD CONSTRAINT [conveyanceDetails_itemTypeId_fkey] FOREIGN KEY ([itemTypeId]) REFERENCES [dbo].[itemTypes]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[conveyanceDetails] ADD CONSTRAINT [conveyanceDetails_vehicleTypeId_fkey] FOREIGN KEY ([vehicleTypeId]) REFERENCES [dbo].[vehicleTypes]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
