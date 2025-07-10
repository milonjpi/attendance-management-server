/*
  Warnings:

  - You are about to drop the `conveyanceDetails` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `conveyances` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[conveyanceDetails] DROP CONSTRAINT [conveyanceDetails_conveyanceId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[conveyanceDetails] DROP CONSTRAINT [conveyanceDetails_itemTypeId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[conveyances] DROP CONSTRAINT [conveyances_officeId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[conveyances] DROP CONSTRAINT [conveyances_userId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[conveyances] DROP CONSTRAINT [conveyances_vehicleTypeId_fkey];

-- DropTable
DROP TABLE [dbo].[conveyanceDetails];

-- DropTable
DROP TABLE [dbo].[conveyances];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
