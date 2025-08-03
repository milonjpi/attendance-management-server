BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[EmployeeLocation] (
    [employeeId] INT NOT NULL,
    [locationId] INT NOT NULL,
    CONSTRAINT [EmployeeLocation_pkey] PRIMARY KEY CLUSTERED ([employeeId],[locationId])
);

-- AddForeignKey
ALTER TABLE [dbo].[EmployeeLocation] ADD CONSTRAINT [EmployeeLocation_employeeId_fkey] FOREIGN KEY ([employeeId]) REFERENCES [dbo].[employees]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[EmployeeLocation] ADD CONSTRAINT [EmployeeLocation_locationId_fkey] FOREIGN KEY ([locationId]) REFERENCES [dbo].[locations]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
