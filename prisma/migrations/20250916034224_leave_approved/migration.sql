BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[leaves] ADD [approvedTime] DATETIME2,
[approverId] INT;

-- AddForeignKey
ALTER TABLE [dbo].[leaves] ADD CONSTRAINT [leaves_approverId_fkey] FOREIGN KEY ([approverId]) REFERENCES [dbo].[employees]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
