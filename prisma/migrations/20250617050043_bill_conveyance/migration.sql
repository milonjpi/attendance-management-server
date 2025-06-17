BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[itemTypes] (
    [id] INT NOT NULL IDENTITY(1,1),
    [label] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [itemTypes_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [itemTypes_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [itemTypes_label_key] UNIQUE NONCLUSTERED ([label])
);

-- CreateTable
CREATE TABLE [dbo].[vehicleTypes] (
    [id] INT NOT NULL IDENTITY(1,1),
    [label] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [vehicleTypes_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [vehicleTypes_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [vehicleTypes_label_key] UNIQUE NONCLUSTERED ([label])
);

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

-- CreateTable
CREATE TABLE [dbo].[bills] (
    [id] INT NOT NULL IDENTITY(1,1),
    [officeId] NVARCHAR(1000) NOT NULL,
    [date] DATETIME2 NOT NULL,
    [amount] INT NOT NULL,
    [remarks] NVARCHAR(1000),
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [bills_status_df] DEFAULT 'Pending',
    [userId] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [bills_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [bills_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[items] (
    [id] INT NOT NULL IDENTITY(1,1),
    [label] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [items_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [items_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [items_label_key] UNIQUE NONCLUSTERED ([label])
);

-- CreateTable
CREATE TABLE [dbo].[shops] (
    [id] INT NOT NULL IDENTITY(1,1),
    [label] NVARCHAR(1000) NOT NULL,
    [address] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [shops_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [shops_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [shops_label_key] UNIQUE NONCLUSTERED ([label])
);

-- CreateTable
CREATE TABLE [dbo].[uom] (
    [id] INT NOT NULL IDENTITY(1,1),
    [label] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [uom_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [uom_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [uom_label_key] UNIQUE NONCLUSTERED ([label])
);

-- CreateTable
CREATE TABLE [dbo].[billDetails] (
    [id] INT NOT NULL IDENTITY(1,1),
    [itemId] INT NOT NULL,
    [shopId] INT,
    [details] NVARCHAR(1000),
    [uomId] INT,
    [quantity] FLOAT(53),
    [amount] INT NOT NULL,
    [remarks] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [billDetails_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [billDetails_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[conveyances] ADD CONSTRAINT [conveyances_officeId_fkey] FOREIGN KEY ([officeId]) REFERENCES [dbo].[employees]([officeId]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[conveyances] ADD CONSTRAINT [conveyances_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[conveyanceDetails] ADD CONSTRAINT [conveyanceDetails_itemTypeId_fkey] FOREIGN KEY ([itemTypeId]) REFERENCES [dbo].[itemTypes]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[conveyanceDetails] ADD CONSTRAINT [conveyanceDetails_vehicleTypeId_fkey] FOREIGN KEY ([vehicleTypeId]) REFERENCES [dbo].[vehicleTypes]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[bills] ADD CONSTRAINT [bills_officeId_fkey] FOREIGN KEY ([officeId]) REFERENCES [dbo].[employees]([officeId]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[bills] ADD CONSTRAINT [bills_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[billDetails] ADD CONSTRAINT [billDetails_itemId_fkey] FOREIGN KEY ([itemId]) REFERENCES [dbo].[items]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[billDetails] ADD CONSTRAINT [billDetails_shopId_fkey] FOREIGN KEY ([shopId]) REFERENCES [dbo].[shops]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[billDetails] ADD CONSTRAINT [billDetails_uomId_fkey] FOREIGN KEY ([uomId]) REFERENCES [dbo].[uom]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
