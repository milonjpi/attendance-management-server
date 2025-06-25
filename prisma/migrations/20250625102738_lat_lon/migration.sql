BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[attendances] ADD [deviceId] NVARCHAR(1000),
[location] NVARCHAR(1000);

-- AlterTable
ALTER TABLE [dbo].[locations] ADD [lat] NVARCHAR(1000),
[lon] NVARCHAR(1000);

-- AlterTable
ALTER TABLE [dbo].[users] ADD [deviceId] NVARCHAR(1000);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
