/*
  Warnings:

  - You are about to drop the column `employeeId` on the `attendances` table. All the data in the column will be lost.
  - You are about to drop the column `employeeId` on the `authLogs` table. All the data in the column will be lost.
  - The primary key for the `employees` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `employees` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - Added the required column `officeId` to the `attendances` table without a default value. This is not possible if the table is not empty.
  - Added the required column `officeId` to the `authLogs` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[attendances] DROP CONSTRAINT [attendances_employeeId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[authLogs] DROP CONSTRAINT [authLogs_employeeId_fkey];

-- AlterTable
ALTER TABLE [dbo].[attendances] DROP COLUMN [employeeId];
ALTER TABLE [dbo].[attendances] ADD [officeId] NVARCHAR(1000) NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[authLogs] DROP COLUMN [employeeId];
ALTER TABLE [dbo].[authLogs] ADD [officeId] NVARCHAR(1000) NOT NULL;

-- RedefineTables
BEGIN TRANSACTION;
DECLARE @SQL NVARCHAR(MAX) = N''
SELECT @SQL += N'ALTER TABLE '
    + QUOTENAME(OBJECT_SCHEMA_NAME(PARENT_OBJECT_ID))
    + '.'
    + QUOTENAME(OBJECT_NAME(PARENT_OBJECT_ID))
    + ' DROP CONSTRAINT '
    + OBJECT_NAME(OBJECT_ID) + ';'
FROM SYS.OBJECTS
WHERE TYPE_DESC LIKE '%CONSTRAINT'
    AND OBJECT_NAME(PARENT_OBJECT_ID) = 'employees'
    AND SCHEMA_NAME(SCHEMA_ID) = 'dbo'
EXEC sp_executesql @SQL
;
CREATE TABLE [dbo].[_prisma_new_employees] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [officeId] NVARCHAR(1000) NOT NULL,
    [joiningDate] DATETIME2,
    [resignDate] DATETIME2,
    [designationId] INT NOT NULL,
    [departmentId] INT NOT NULL,
    [locationId] INT NOT NULL,
    [contactNo] NVARCHAR(1000),
    [address] NVARCHAR(1000),
    [photo] NVARCHAR(1000),
    [isActive] BIT NOT NULL CONSTRAINT [employees_isActive_df] DEFAULT 1,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [employees_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [employees_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [employees_officeId_key] UNIQUE NONCLUSTERED ([officeId])
);
SET IDENTITY_INSERT [dbo].[_prisma_new_employees] ON;
IF EXISTS(SELECT * FROM [dbo].[employees])
    EXEC('INSERT INTO [dbo].[_prisma_new_employees] ([address],[contactNo],[createdAt],[departmentId],[designationId],[id],[isActive],[joiningDate],[locationId],[name],[officeId],[photo],[resignDate],[updatedAt]) SELECT [address],[contactNo],[createdAt],[departmentId],[designationId],[id],[isActive],[joiningDate],[locationId],[name],[officeId],[photo],[resignDate],[updatedAt] FROM [dbo].[employees] WITH (holdlock tablockx)');
SET IDENTITY_INSERT [dbo].[_prisma_new_employees] OFF;
DROP TABLE [dbo].[employees];
EXEC SP_RENAME N'dbo._prisma_new_employees', N'employees';
COMMIT;

-- AddForeignKey
ALTER TABLE [dbo].[authLogs] ADD CONSTRAINT [authLogs_officeId_fkey] FOREIGN KEY ([officeId]) REFERENCES [dbo].[employees]([officeId]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[attendances] ADD CONSTRAINT [attendances_officeId_fkey] FOREIGN KEY ([officeId]) REFERENCES [dbo].[employees]([officeId]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
