BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[bills] DROP CONSTRAINT [bills_officeId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[conveyances] DROP CONSTRAINT [conveyances_officeId_fkey];

-- AlterTable
ALTER TABLE [dbo].[bills] ADD [approvedTime] DATETIME2,
[approverId] INT;

-- AlterTable
ALTER TABLE [dbo].[conveyances] ADD [approvedTime] DATETIME2,
[approverId] INT;

-- AddForeignKey
ALTER TABLE [dbo].[conveyances] ADD CONSTRAINT [conveyances_officeId_fkey] FOREIGN KEY ([officeId]) REFERENCES [dbo].[employees]([officeId]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[conveyances] ADD CONSTRAINT [conveyances_approverId_fkey] FOREIGN KEY ([approverId]) REFERENCES [dbo].[employees]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[bills] ADD CONSTRAINT [bills_officeId_fkey] FOREIGN KEY ([officeId]) REFERENCES [dbo].[employees]([officeId]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[bills] ADD CONSTRAINT [bills_approverId_fkey] FOREIGN KEY ([approverId]) REFERENCES [dbo].[employees]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
