BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[bills] ADD [locationId] INT;

-- AddForeignKey
ALTER TABLE [dbo].[bills] ADD CONSTRAINT [bills_locationId_fkey] FOREIGN KEY ([locationId]) REFERENCES [dbo].[locations]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
