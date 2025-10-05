-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "profileImg" TEXT,
    "deviceId" TEXT,
    "isEmployee" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "menuPermissions" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "menuPermissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subMenuPermissions" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "subMenuPermissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sectionPermissions" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "sectionPermissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "designations" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "designations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "departments" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "areas" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "areas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "locations" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "areaId" INTEGER,
    "address" TEXT,
    "lat" TEXT,
    "lon" TEXT,
    "weekend" TEXT NOT NULL DEFAULT 'Friday',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employees" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "officeId" TEXT NOT NULL,
    "joiningDate" TIMESTAMP(3),
    "resignDate" TIMESTAMP(3),
    "designationId" INTEGER NOT NULL,
    "departmentId" INTEGER NOT NULL,
    "locationId" INTEGER NOT NULL,
    "contactNo" TEXT,
    "address" TEXT,
    "photo" TEXT,
    "signature" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isOwn" BOOLEAN NOT NULL DEFAULT false,
    "userCreated" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeLocation" (
    "employeeId" INTEGER NOT NULL,
    "locationId" INTEGER NOT NULL,

    CONSTRAINT "EmployeeLocation_pkey" PRIMARY KEY ("employeeId","locationId")
);

-- CreateTable
CREATE TABLE "authLogs" (
    "id" SERIAL NOT NULL,
    "officeId" TEXT NOT NULL,
    "punchTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "authLogs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendances" (
    "id" SERIAL NOT NULL,
    "officeId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "inTime" TIMESTAMP(3),
    "outTime" TIMESTAMP(3),
    "deviceId" TEXT,
    "location" TEXT,
    "remarks" TEXT,
    "realPunch" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "attendances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leaves" (
    "id" SERIAL NOT NULL,
    "officeId" TEXT NOT NULL,
    "fromDate" TIMESTAMP(3) NOT NULL,
    "days" INTEGER NOT NULL,
    "toDate" TIMESTAMP(3) NOT NULL,
    "remarks" TEXT,
    "approverId" INTEGER,
    "approvedTime" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leaves_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "salaries" (
    "id" SERIAL NOT NULL,
    "officeId" TEXT NOT NULL,
    "fromDate" TIMESTAMP(3) NOT NULL,
    "toDate" TIMESTAMP(3),
    "salary" INTEGER NOT NULL DEFAULT 0,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "salaries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transfers" (
    "id" SERIAL NOT NULL,
    "officeId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "fromLocationId" INTEGER NOT NULL,
    "toLocationId" INTEGER NOT NULL,
    "remarks" TEXT,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transfers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "itemTypes" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "itemTypes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicleTypes" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vehicleTypes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conveyances" (
    "id" SERIAL NOT NULL,
    "officeId" TEXT NOT NULL,
    "locationId" INTEGER,
    "date" TIMESTAMP(3) NOT NULL,
    "month" TEXT,
    "year" TEXT,
    "amount" INTEGER NOT NULL,
    "remarks" TEXT,
    "approverId" INTEGER,
    "approvedTime" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "conveyances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conveyanceDetails" (
    "id" SERIAL NOT NULL,
    "conveyanceId" INTEGER NOT NULL,
    "itemTypeId" INTEGER NOT NULL,
    "from" TEXT,
    "to" TEXT,
    "distance" INTEGER NOT NULL DEFAULT 0,
    "vehicleTypeId" INTEGER,
    "details" TEXT,
    "amount" INTEGER NOT NULL,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "conveyanceDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bills" (
    "id" SERIAL NOT NULL,
    "isService" BOOLEAN NOT NULL DEFAULT false,
    "locationId" INTEGER,
    "officeId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "month" TEXT,
    "year" TEXT,
    "amount" INTEGER NOT NULL,
    "remarks" TEXT,
    "approverId" INTEGER,
    "approvedTime" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "items" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "isService" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shops" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shops_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "uom" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "uom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "billDetails" (
    "id" SERIAL NOT NULL,
    "billId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
    "shopId" INTEGER,
    "details" TEXT,
    "uomId" INTEGER,
    "quantity" DOUBLE PRECISION,
    "amount" INTEGER NOT NULL,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "billDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "monthSalaries" (
    "id" SERIAL NOT NULL,
    "month" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "locationId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "monthSalaries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "monthSalaryDetails" (
    "id" SERIAL NOT NULL,
    "monthSalaryId" INTEGER NOT NULL,
    "officeId" TEXT NOT NULL,
    "totalDays" INTEGER NOT NULL,
    "weekends" INTEGER NOT NULL,
    "workingDays" INTEGER NOT NULL,
    "actualPresents" INTEGER NOT NULL,
    "presents" INTEGER NOT NULL,
    "lateCounts" INTEGER NOT NULL,
    "leaves" INTEGER NOT NULL,
    "absents" INTEGER NOT NULL,
    "salary" INTEGER NOT NULL,
    "earnSalary" INTEGER NOT NULL,
    "deduction" INTEGER NOT NULL,
    "isAccepted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "monthSalaryDetails_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_userName_key" ON "users"("userName");

-- CreateIndex
CREATE UNIQUE INDEX "designations_label_key" ON "designations"("label");

-- CreateIndex
CREATE UNIQUE INDEX "departments_label_key" ON "departments"("label");

-- CreateIndex
CREATE UNIQUE INDEX "areas_label_key" ON "areas"("label");

-- CreateIndex
CREATE UNIQUE INDEX "locations_label_key" ON "locations"("label");

-- CreateIndex
CREATE UNIQUE INDEX "employees_officeId_key" ON "employees"("officeId");

-- CreateIndex
CREATE UNIQUE INDEX "itemTypes_label_key" ON "itemTypes"("label");

-- CreateIndex
CREATE UNIQUE INDEX "vehicleTypes_label_key" ON "vehicleTypes"("label");

-- CreateIndex
CREATE UNIQUE INDEX "items_label_key" ON "items"("label");

-- CreateIndex
CREATE UNIQUE INDEX "shops_label_key" ON "shops"("label");

-- CreateIndex
CREATE UNIQUE INDEX "uom_label_key" ON "uom"("label");

-- CreateIndex
CREATE UNIQUE INDEX "monthSalaries_month_year_locationId_key" ON "monthSalaries"("month", "year", "locationId");

-- AddForeignKey
ALTER TABLE "menuPermissions" ADD CONSTRAINT "menuPermissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subMenuPermissions" ADD CONSTRAINT "subMenuPermissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sectionPermissions" ADD CONSTRAINT "sectionPermissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "locations_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "areas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_designationId_fkey" FOREIGN KEY ("designationId") REFERENCES "designations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeLocation" ADD CONSTRAINT "EmployeeLocation_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "EmployeeLocation" ADD CONSTRAINT "EmployeeLocation_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "authLogs" ADD CONSTRAINT "authLogs_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "employees"("officeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendances" ADD CONSTRAINT "attendances_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "employees"("officeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leaves" ADD CONSTRAINT "leaves_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "employees"("officeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leaves" ADD CONSTRAINT "leaves_approverId_fkey" FOREIGN KEY ("approverId") REFERENCES "employees"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "salaries" ADD CONSTRAINT "salaries_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "employees"("officeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transfers" ADD CONSTRAINT "transfers_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "employees"("officeId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "transfers" ADD CONSTRAINT "transfers_fromLocationId_fkey" FOREIGN KEY ("fromLocationId") REFERENCES "locations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "transfers" ADD CONSTRAINT "transfers_toLocationId_fkey" FOREIGN KEY ("toLocationId") REFERENCES "locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conveyances" ADD CONSTRAINT "conveyances_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "employees"("officeId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "conveyances" ADD CONSTRAINT "conveyances_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "conveyances" ADD CONSTRAINT "conveyances_approverId_fkey" FOREIGN KEY ("approverId") REFERENCES "employees"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "conveyances" ADD CONSTRAINT "conveyances_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conveyanceDetails" ADD CONSTRAINT "conveyanceDetails_conveyanceId_fkey" FOREIGN KEY ("conveyanceId") REFERENCES "conveyances"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conveyanceDetails" ADD CONSTRAINT "conveyanceDetails_itemTypeId_fkey" FOREIGN KEY ("itemTypeId") REFERENCES "itemTypes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conveyanceDetails" ADD CONSTRAINT "conveyanceDetails_vehicleTypeId_fkey" FOREIGN KEY ("vehicleTypeId") REFERENCES "vehicleTypes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bills" ADD CONSTRAINT "bills_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "bills" ADD CONSTRAINT "bills_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "employees"("officeId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "bills" ADD CONSTRAINT "bills_approverId_fkey" FOREIGN KEY ("approverId") REFERENCES "employees"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "bills" ADD CONSTRAINT "bills_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "billDetails" ADD CONSTRAINT "billDetails_billId_fkey" FOREIGN KEY ("billId") REFERENCES "bills"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "billDetails" ADD CONSTRAINT "billDetails_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "billDetails" ADD CONSTRAINT "billDetails_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "shops"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "billDetails" ADD CONSTRAINT "billDetails_uomId_fkey" FOREIGN KEY ("uomId") REFERENCES "uom"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monthSalaries" ADD CONSTRAINT "monthSalaries_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monthSalaryDetails" ADD CONSTRAINT "monthSalaryDetails_monthSalaryId_fkey" FOREIGN KEY ("monthSalaryId") REFERENCES "monthSalaries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "monthSalaryDetails" ADD CONSTRAINT "monthSalaryDetails_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "employees"("officeId") ON DELETE RESTRICT ON UPDATE CASCADE;
