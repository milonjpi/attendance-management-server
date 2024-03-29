BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[employees] ADD [isActive] BIT NOT NULL CONSTRAINT [employees_isActive_df] DEFAULT 1;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
