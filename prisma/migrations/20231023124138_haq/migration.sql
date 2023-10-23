BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[authLogs] DROP CONSTRAINT [authLogs_empId_fkey];

-- AlterTable
ALTER TABLE [dbo].[authLogs] ALTER COLUMN [empId] NVARCHAR(1000) NOT NULL;

-- AddForeignKey
ALTER TABLE [dbo].[authLogs] ADD CONSTRAINT [authLogs_empId_fkey] FOREIGN KEY ([empId]) REFERENCES [dbo].[employees]([employeeId]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
