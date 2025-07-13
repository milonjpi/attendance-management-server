/*
  Warnings:

  - You are about to drop the `monthSalaries` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[monthSalaries] DROP CONSTRAINT [monthSalaries_officeId_fkey];

-- DropTable
DROP TABLE [dbo].[monthSalaries];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
