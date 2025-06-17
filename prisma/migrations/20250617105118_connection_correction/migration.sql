/*
  Warnings:

  - Added the required column `billId` to the `billDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `conveyanceId` to the `conveyanceDetails` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[billDetails] ADD [billId] INT NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[conveyanceDetails] ADD [conveyanceId] INT NOT NULL;

-- AddForeignKey
ALTER TABLE [dbo].[conveyanceDetails] ADD CONSTRAINT [conveyanceDetails_conveyanceId_fkey] FOREIGN KEY ([conveyanceId]) REFERENCES [dbo].[conveyances]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[billDetails] ADD CONSTRAINT [billDetails_billId_fkey] FOREIGN KEY ([billId]) REFERENCES [dbo].[bills]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
