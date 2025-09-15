BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[conveyances] ADD [locationId] INT;

-- AddForeignKey
ALTER TABLE [dbo].[conveyances] ADD CONSTRAINT [conveyances_locationId_fkey] FOREIGN KEY ([locationId]) REFERENCES [dbo].[locations]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
