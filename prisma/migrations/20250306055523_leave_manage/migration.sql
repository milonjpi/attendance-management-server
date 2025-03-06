BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[leaves] (
    [id] INT NOT NULL IDENTITY(1,1),
    [officeId] NVARCHAR(1000) NOT NULL,
    [fromDate] DATETIME2 NOT NULL,
    [days] INT NOT NULL,
    [toDate] DATETIME2 NOT NULL,
    [remarks] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [leaves_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [leaves_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[leaves] ADD CONSTRAINT [leaves_officeId_fkey] FOREIGN KEY ([officeId]) REFERENCES [dbo].[employees]([officeId]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
