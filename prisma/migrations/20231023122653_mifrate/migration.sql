/*
  Warnings:

  - You are about to drop the column `employeeId` on the `authLogs` table. All the data in the column will be lost.
  - Added the required column `empId` to the `authLogs` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[authLogs] DROP CONSTRAINT [authLogs_employeeId_fkey];

-- AlterTable
ALTER TABLE [dbo].[authLogs] DROP COLUMN [employeeId];
ALTER TABLE [dbo].[authLogs] ADD [empId] NVARCHAR(1000) NOT NULL;

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
