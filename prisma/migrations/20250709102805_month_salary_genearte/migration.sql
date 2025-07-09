BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[monthSalaries] (
    [id] INT NOT NULL IDENTITY(1,1),
    [month] NVARCHAR(1000) NOT NULL,
    [year] NVARCHAR(1000) NOT NULL,
    [officeId] NVARCHAR(1000) NOT NULL,
    [totalDays] INT NOT NULL,
    [weekends] INT NOT NULL,
    [workingDays] INT NOT NULL,
    [presents] INT NOT NULL,
    [lateCounts] INT NOT NULL,
    [leaves] INT NOT NULL,
    [absents] INT NOT NULL,
    [salary] INT NOT NULL,
    [earnSalary] INT NOT NULL,
    [deduction] INT NOT NULL,
    [isAccepted] BIT NOT NULL CONSTRAINT [monthSalaries_isAccepted_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [monthSalaries_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [monthSalaries_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[monthSalaries] ADD CONSTRAINT [monthSalaries_officeId_fkey] FOREIGN KEY ([officeId]) REFERENCES [dbo].[employees]([officeId]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
