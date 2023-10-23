/*
  Warnings:

  - You are about to alter the column `empId` on the `authLogs` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(1000)` to `Int`.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[authLogs] DROP CONSTRAINT [authLogs_empId_fkey];

-- AlterTable
ALTER TABLE [dbo].[authLogs] ALTER COLUMN [empId] INT NOT NULL;

-- AddForeignKey
ALTER TABLE [dbo].[authLogs] ADD CONSTRAINT [authLogs_empId_fkey] FOREIGN KEY ([empId]) REFERENCES [dbo].[employees]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
